import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { configuration, runAudit } from '../../scripts/clientverse-audit.mjs';

// Synthetic service responses verify transport behavior; never live audit proof.
const env = {
  CLIENTVERSE_ENDPOINT: 'https://audit.example.com',
  CLIENTVERSE_TOKEN: `cva_${'synthetic-test-token-'.repeat(3)}`,
  REPOSITORY: 'example/website', COMMIT_SHA: 'a'.repeat(40),
  DEPLOYMENT_URL: 'https://candidate.example.com',
};
const id = 'aud_12345678-1234-1234-1234-123456789abc';
const request = configuration(env).request;
const artifacts = [{ name: 'report.html', sha256: 'b'.repeat(64), byte_size: 123, storage_uri: 'github-actions://1/audit/report.html' }];
const manifest = createHash('sha256').update(JSON.stringify(artifacts.map(({name,sha256,byte_size}) => ({name,sha256,byte_size})))).digest('hex');
function audit(status = 'completed', decision = 'APPROVED') {
  return { ...request, id, status, decision, evidence_manifest_sha256: manifest };
}
function evidence(decision = 'APPROVED') {
  return { ...request, audit_id: id, decision, artifacts, manifest_sha256: manifest };
}
const findings = { audit_id: id, findings: [] };
function setup(responses, overrides = {}) {
  const saved = {};
  const calls = [];
  let time = 0;
  return { saved, calls, options: {
    env, readConfig: async () => 'existing project configuration',
    save: async (name, value) => { saved[name] = structuredClone(value); },
    now: () => time, sleep: async (ms) => { time += ms; },
    fetchImpl: async (url, options) => {
      calls.push({ url, ...options });
      const item = responses.shift();
      assert.ok(item, 'Unexpected API request');
      return { status: item.http ?? 200, json: async () => {
        if (item.malformed) throw new Error('html');
        return item.body;
      } };
    },
    ...overrides,
  } };
}
const submit = () => ({ http: 202, body: { audit_id: id, status: 'queued' } });
const terminal = (decision = 'APPROVED') => [submit(), {body:audit('completed',decision)}, {body:evidence(decision)}, {body:findings}];

test('acceptance is followed by polling and exact-candidate evidence before approval', async () => {
  const fixture = setup([submit(), {body:audit('queued','UNKNOWN')}, {body:audit('running','UNKNOWN')},
    {body:audit()}, {body:evidence()}, {body:findings}]);
  const result = await runAudit(fixture.options);
  assert.equal(result.release_gate, 'APPROVED');
  assert.equal(result.audit_completed, true);
  assert.equal(fixture.calls.length, 6);
  assert.equal(fixture.calls[0].url, 'https://audit.example.com/api/audits');
  assert.deepEqual(JSON.parse(fixture.calls[0].body), request);
  for (const call of fixture.calls) assert.equal(call.redirect, 'error');
  assert.ok(fixture.saved['evidence.json']);
  assert.ok(fixture.saved['findings.json']);
});

test('base URL and submission route resolve to the same API', () => {
  assert.equal(configuration({...env, CLIENTVERSE_ENDPOINT:'https://audit.example.com/api/audits/'}).endpoint,
    configuration(env).endpoint);
});

test('PostgreSQL decimal-string byte sizes retain the original manifest identity', async () => {
  const responses = terminal();
  responses[2].body = {...evidence(),artifacts:artifacts.map((item) => ({...item,byte_size:String(item.byte_size)}))};
  const result = await runAudit(setup(responses).options);
  assert.equal(result.release_gate, 'APPROVED');
});

test('preflight never reports a website pass and makes no network calls', async () => {
  const fixture = setup([], {preflightOnly:true});
  const result = await runAudit(fixture.options);
  assert.equal(result.configuration_valid, true);
  assert.equal(result.audit_completed, false);
  assert.equal(result.release_gate, 'BLOCKED');
  assert.equal(fixture.calls.length, 0);
});

test('missing configuration leaves a diagnostic artifact and makes no request', async () => {
  const fixture = setup([], {env:{...env, CLIENTVERSE_TOKEN:''}});
  await assert.rejects(runAudit(fixture.options), /MISSING_CONFIGURATION: CLIENTVERSE_TOKEN/);
  assert.equal(fixture.saved['result.json'].release_gate, 'BLOCKED');
  assert.equal(fixture.calls.length, 0);
});

for (const url of ['http://audit.example.com','https://user:pass@audit.example.com','https://audit.example.com?token=x','https://audit.example.com/api/public-audits']) {
  test(`reject unsafe or wrong service endpoint ${url}`, () => {
    assert.throws(() => configuration({...env, CLIENTVERSE_ENDPOINT:url}));
  });
}

for (const http of [200, 301, 401, 403, 429, 503]) {
  test(`submission HTTP ${http} cannot certify a release`, async () => {
    const fixture = setup([{http,body:{status:'APPROVED'}}]);
    await assert.rejects(runAudit(fixture.options), new RegExp(`HTTP_${http}`));
    assert.equal(fixture.saved['result.json'].release_gate, 'BLOCKED');
  });
}

test('malformed JSON fails closed', async () => {
  const fixture = setup([{http:202,malformed:true}]);
  await assert.rejects(runAudit(fixture.options), /UNPARSEABLE_RESPONSE/);
});

test('a queued audit that never completes times out without approval', async () => {
  const fixture = setup([submit(),{body:audit('queued','UNKNOWN')}],{timeoutMs:5000});
  await assert.rejects(runAudit(fixture.options), /AUDIT_TIMEOUT/);
  assert.equal(fixture.saved['result.json'].audit_completed, false);
});

test('completed BLOCKED audit retains findings and evidence but fails release', async () => {
  const fixture = setup(terminal('BLOCKED'));
  await assert.rejects(runAudit(fixture.options), /RELEASE_BLOCKED/);
  assert.equal(fixture.saved['result.json'].audit_completed, true);
  assert.equal(fixture.saved['result.json'].release_gate, 'BLOCKED');
  assert.equal(fixture.saved['evidence.json'].decision, 'BLOCKED');
  assert.ok(fixture.saved['findings.json']);
});

test('error audit retrieves available evidence before failing', async () => {
  const fixture = setup([submit(), {body:audit('error','BLOCKED')}, {body:evidence('BLOCKED')}, {body:findings}]);
  await assert.rejects(runAudit(fixture.options), /AUDIT_NOT_COMPLETED/);
  assert.ok(fixture.saved['evidence.json']);
});

for (const key of ['repository','commit_sha','deployment_url','policy_version']) {
  test(`mismatched ${key} cannot certify another candidate`, async () => {
    const responses = terminal();
    responses[2].body = {...evidence(),[key]:'different'};
    await assert.rejects(runAudit(setup(responses).options), /CANDIDATE_MISMATCH/);
  });
}

for (const change of [{artifacts:[]},{manifest_sha256:'0'.repeat(64)},{decision:'OK'},{audit_id:'aud_wrong'}]) {
  test(`invalid evidence cannot pass: ${Object.keys(change)[0]}`, async () => {
    const responses = terminal();
    responses[2].body = {...evidence(),...change};
    await assert.rejects(runAudit(setup(responses).options));
  });
}

test('unknown status and arbitrary transport exception text never become a pass', async () => {
  await assert.rejects(runAudit(setup([submit(),{body:audit('OK')}]).options), /UNKNOWN_AUDIT_STATUS/);
  const fixture = setup([], {fetchImpl:async () => {throw new Error(env.CLIENTVERSE_TOKEN);}});
  await assert.rejects(runAudit(fixture.options), /^Error: INTEGRATION_ERROR$/);
  assert.equal(JSON.stringify(fixture.saved).includes(env.CLIENTVERSE_TOKEN), false);
});
