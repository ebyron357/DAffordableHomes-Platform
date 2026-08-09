const attempts = new Map();
const allowedPrograms = new Set(["", "naca", "homes-for-heroes", "garland"]);
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
const html = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export default async function handler(request, response) {
  if (request.method !== "POST") { response.setHeader("Allow", "POST"); return response.status(405).json({ error: "Method not allowed." }); }
  const ip = clean(request.headers["x-forwarded-for"]?.split(",")[0] || "unknown", 64), now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 60_000); recent.push(now); attempts.set(ip, recent);
  if (recent.length > 5) return response.status(429).json({ error: "Too many requests. Please wait and try again." });
  let body = request.body || {}; if (typeof body === "string") { try { body = JSON.parse(body); } catch { return response.status(400).json({ error: "Invalid request." }); } }
  if (clean(body.website, 200)) return response.status(200).json({ ok: true });
  const lead = { name: clean(body.name, 120), email: clean(body.email, 254).toLowerCase(), stage: clean(body.stage, 160), goal: clean(body.goal, 160), message: clean(body.message, 3000), program: clean(body.program, 40), submittedAt: new Date().toISOString(), source: "daffordablehomes-platform" };
  if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || !lead.stage || !allowedPrograms.has(lead.program)) return response.status(400).json({ error: "Provide a valid name, email, and homebuying stage." });
  const deliveries = [];
  const webhookUrl = process.env.LEAD_WEBHOOK_URL ?? process.env.PROGRAM_LEAD_WEBHOOK_URL ?? process.env.GHL_PROGRAM_LEAD_WEBHOOK_URL;
  if (webhookUrl) { const result = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.LEAD_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify(lead), signal: AbortSignal.timeout(8_000) }); if (!result.ok) return response.status(502).json({ error: "Lead delivery failed. Please try again." }); deliveries.push("webhook"); }
  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) { const result = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.LEAD_FROM_EMAIL || "D'Affordable Homes <onboarding@resend.dev>", to: [process.env.LEAD_NOTIFICATION_EMAIL], reply_to: lead.email, subject: `New consultation request — ${lead.name}`, html: `<h1>New consultation request</h1><p><b>Name:</b> ${html(lead.name)}</p><p><b>Email:</b> ${html(lead.email)}</p><p><b>Stage:</b> ${html(lead.stage)}</p><p><b>Goal:</b> ${html(lead.goal || "Not selected")}</p><p><b>Program:</b> ${html(lead.program || "General")}</p><p><b>Message:</b> ${html(lead.message || "None")}</p>` }) }); if (!result.ok) return response.status(502).json({ error: "Email delivery failed. Please try again." }); deliveries.push("email"); }
  if (!deliveries.length) return response.status(503).json({ error: "Consultation delivery is not configured yet. Please try again later." });
  return response.status(201).json({ ok: true, delivered: deliveries });
}
