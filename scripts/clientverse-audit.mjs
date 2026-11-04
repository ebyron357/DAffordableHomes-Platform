// Transport only: scanners and release decisions remain in the central service.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const CONFIG = 'qa-config/clientverse-audit.yaml';
const DIGEST = /^[a-f0-9]{64}$/;
const AUDIT_ID = /^aud_[a-f0-9-]{36}$/;
const hash = (value) => createHash('sha256').update(value).digest('hex');
function requireValue(condition, code) { if (!condition) throw new Error(code); }

function httpsUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { throw new Error('INVALID_HTTPS_URL'); }
  requireValue(url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash, 'INVALID_HTTPS_URL');
  return url;
}

export function configuration(env) {
  const missing = ['CLIENTVERSE_ENDPOINT', 'CLIENTVERSE_TOKEN', 'DEPLOYMENT_URL', 'COMMIT_SHA', 'REPOSITORY']
    .filter((name) => !env[name]?.trim());
  requireValue(!missing.length, `MISSING_CONFIGURATION: ${missing.join(', ')}`);
  requireValue(/^[a-f0-9]{40}$/.test(env.COMMIT_SHA), 'INVALID_COMMIT_SHA');
  requireValue(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(env.REPOSITORY), 'INVALID_REPOSITORY');
  requireValue(/^cva_[A-Za-z0-9_-]{32,}$/.test(env.CLIENTVERSE_TOKEN), 'INVALID_PROJECT_TOKEN');
  const endpoint = httpsUrl(env.CLIENTVERSE_ENDPOINT.trim());
  requireValue(['/', '/api/audits', '/api/audits/'].includes(endpoint.pathname), 'INVALID_ENDPOINT_PATH');
  endpoint.pathname = '/api/audits';
  const deployment = httpsUrl(env.DEPLOYMENT_URL.trim());
  return {
    endpoint: endpoint.toString(), token: env.CLIENTVERSE_TOKEN,
    request: {
      repository: env.REPOSITORY, commit_sha: env.COMMIT_SHA,
      deployment_url: deployment.toString().replace(/\/$/, ''),
      application_path: 'apps/web',
      // Revision identity only: the runner still needs an adapter for this
      // configuration schema. This value does not assert policy approval.
      policy_version: `${env.COMMIT_SHA}:${CONFIG}`,
    },
  };
}

function checkIdentity(record, request) {
  for (const key of ['repository', 'commit_sha', 'deployment_url', 'policy_version']) {
    requireValue(record[key] === request[key], `CANDIDATE_MISMATCH: ${key}`);
  }
}

export function verifyEvidence(audit, evidence, request, auditId) {
  checkIdentity(audit, request);
  checkIdentity(evidence, request);
  requireValue(audit.id === auditId && evidence.audit_id === auditId, 'AUDIT_ID_MISMATCH');
  requireValue(audit.status === 'completed', 'AUDIT_NOT_COMPLETED');
  requireValue(['APPROVED', 'BLOCKED'].includes(audit.decision) && evidence.decision === audit.decision, 'DECISION_MISMATCH');
  requireValue(Array.isArray(evidence.artifacts) && evidence.artifacts.length > 0, 'MISSING_EVIDENCE');
  const names = new Set();
  for (const item of evidence.artifacts) {
    // PostgreSQL bigint fields are serialized as decimal strings by the
    // central store; the original manifest hashes numeric byte sizes.
    const size = typeof item.byte_size === 'string' && /^[0-9]+$/.test(item.byte_size)
      ? Number(item.byte_size) : item.byte_size;
    requireValue(typeof item.name === 'string' && !names.has(item.name) && DIGEST.test(item.sha256)
      && Number.isSafeInteger(size) && size > 0
      && typeof item.storage_uri === 'string' && item.storage_uri.length > 0, 'INVALID_EVIDENCE');
    names.add(item.name);
  }
  const manifest = evidence.artifacts.map(({ name, sha256, byte_size }) => ({ name, sha256, byte_size: Number(byte_size) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  requireValue(DIGEST.test(evidence.manifest_sha256)
    && evidence.manifest_sha256 === hash(JSON.stringify(manifest))
    && audit.evidence_manifest_sha256 === evidence.manifest_sha256, 'EVIDENCE_MANIFEST_MISMATCH');
  return audit.decision;
}

export async function runAudit({ env = process.env, fetchImpl = fetch, save,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = Date.now, timeoutMs = 45 * 60_000, preflightOnly = false,
  readConfig = () => readFile(CONFIG, 'utf8') } = {}) {
  let token = env.CLIENTVERSE_TOKEN || '';
  const persist = save || (async (name, value) => {
    await mkdir('clientverse-evidence', { recursive: true });
    const json = JSON.stringify(value, null, 2);
    await writeFile(`clientverse-evidence/${name}`, `${token ? json.split(token).join('[REDACTED]') : json}\n`);
  });
  const result = { release_gate: 'BLOCKED', audit_completed: false };
  try {
    await persist('result.json', result);
    const config = configuration(env);
    token = config.token;
    const projectConfig = await readConfig();
    await persist('configuration.json', { path: CONFIG, sha256: hash(projectConfig), policy_version: config.request.policy_version });
    await persist('request.json', config.request);
    if (preflightOnly) {
      await persist('result.json', { ...result, configuration_valid: true });
      return { ...result, configuration_valid: true };
    }
    const deadline = now() + timeoutMs;
    const requestJson = async (suffix, method = 'GET', body) => {
      requireValue(now() < deadline, 'AUDIT_TIMEOUT');
      const response = await fetchImpl(`${config.endpoint}${suffix}`, {
        method, redirect: 'error',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(Math.max(1, Math.min(30_000, deadline - now()))),
      });
      await persist('http-status.json', { method, resource: suffix || '/api/audits', status: response.status });
      requireValue(method === 'POST' ? response.status === 202 : response.status === 200, `HTTP_${response.status}`);
      let data;
      try { data = await response.json(); } catch { throw new Error('UNPARSEABLE_RESPONSE'); }
      requireValue(data && typeof data === 'object' && !Array.isArray(data), 'INVALID_RESPONSE');
      return data;
    };
    const submitted = await requestJson('', 'POST', config.request);
    await persist('submission.json', submitted);
    requireValue(AUDIT_ID.test(submitted.audit_id), 'INVALID_AUDIT_ID');
    const auditId = submitted.audit_id;
    result.audit_id = auditId;
    let audit;
    let delay = 5_000;
    while (now() < deadline) {
      audit = await requestJson(`/${auditId}`);
      await persist('status.json', audit);
      checkIdentity(audit, config.request);
      requireValue(audit.id === auditId, 'AUDIT_ID_MISMATCH');
      requireValue(['queued', 'running', 'completed', 'error'].includes(audit.status), 'UNKNOWN_AUDIT_STATUS');
      if (['completed', 'error'].includes(audit.status)) break;
      await sleep(Math.min(delay, Math.max(0, deadline - now())));
      delay = Math.min(Math.round(delay * 1.5), 30_000);
    }
    requireValue(audit && ['completed', 'error'].includes(audit.status), 'AUDIT_TIMEOUT');
    // Keep terminal evidence for BLOCKED/error audits before failing the job.
    const evidence = await requestJson(`/${auditId}/evidence`);
    await persist('evidence.json', evidence);
    const findings = await requestJson(`/${auditId}/findings`);
    await persist('findings.json', findings);
    requireValue(findings.audit_id === auditId && Array.isArray(findings.findings), 'INVALID_FINDINGS_RESPONSE');
    const decision = verifyEvidence(audit, evidence, config.request, auditId);
    result.audit_completed = true;
    requireValue(decision === 'APPROVED', 'RELEASE_BLOCKED');
    result.release_gate = 'APPROVED';
    await persist('result.json', result);
    return result;
  } catch (error) {
    // Never log arbitrary transport exceptions, response bodies, or tokens.
    const known = /^(MISSING_CONFIGURATION: [A-Z_, ]+|CANDIDATE_MISMATCH: [a-z_]+|[A-Z][A-Z_0-9]+)$/;
    result.error = known.test(error.message) ? error.message : 'INTEGRATION_ERROR';
    await persist('result.json', result);
    throw new Error(result.error);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await runAudit({ preflightOnly: process.argv.includes('--preflight') });
    console.log(result.configuration_valid ? 'Configuration validated; no website audit has run.' : 'ClientVerse release gate: APPROVED');
  } catch (error) {
    console.error(`ClientVerse audit BLOCKED: ${error.message}`);
    process.exitCode = 1;
  }
}
