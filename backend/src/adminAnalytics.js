import bcrypt from "bcryptjs";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";

const EVENT_TYPES = new Set([
  "session_start",
  "page_view",
  "section_view",
  "cta_click",
  "discovery_submit",
  "newsletter_subscribe",
]);

const RANGE_DAYS = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const ANALYTICS_TIME_ZONE = "Asia/Dhaka";

/** Homepage sections in scroll order, for the reach funnel. */
const HOME_SECTION_ORDER = [
  { id: "home", label: "Hero" },
  { id: "sprint-numbers", label: "Sprint numbers" },
  { id: "our-clients", label: "Clients" },
  { id: "about-bonotech", label: "About" },
  { id: "ways-in", label: "Service scope" },
  { id: "delivery-times", label: "Delivery times" },
  { id: "our-technology", label: "Technology" },
  { id: "client-testimonials", label: "Testimonials" },
  { id: "discovery-call", label: "Discovery call" },
  { id: "footer", label: "Footer" },
];

const SESSION_LENGTH_BUCKETS = [
  { label: "<10s", min: 0, max: 10 },
  { label: "10–30s", min: 10, max: 30 },
  { label: "30s–1m", min: 30, max: 60 },
  { label: "1–3m", min: 60, max: 180 },
  { label: "3–10m", min: 180, max: 600 },
  { label: "10m+", min: 600, max: Infinity },
];

function getJwtSecret() {
  return process.env.ADMIN_JWT_SECRET?.trim() || "";
}

/**
 * Admins come from ADMIN_EMAIL + ADMIN_PASSWORD_HASH plus ADMIN_USERS,
 * a comma-separated list of `email=bcryptHash` pairs.
 */
function getAdminUsers() {
  const users = new Map();

  const primaryEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const primaryHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
  if (primaryEmail && primaryHash) users.set(primaryEmail, primaryHash);

  for (const entry of (process.env.ADMIN_USERS || "").split(",")) {
    const separator = entry.indexOf("=");
    if (separator <= 0) continue;
    const email = entry.slice(0, separator).trim().toLowerCase();
    const hash = entry.slice(separator + 1).trim();
    if (email && hash) users.set(email, hash);
  }

  return users;
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminUsers().size > 0 && getJwtSecret());
}

export async function verifyAdminLogin(email, password) {
  const users = getAdminUsers();

  if (users.size === 0 || !getJwtSecret()) {
    return { ok: false, error: "Admin auth is not configured on the server." };
  }

  const normalized = String(email || "").trim().toLowerCase();
  const hash = users.get(normalized);
  if (!hash) {
    return { ok: false, error: "Invalid email or password." };
  }

  const matches = await bcrypt.compare(String(password || ""), hash);
  if (!matches) {
    return { ok: false, error: "Invalid email or password." };
  }

  const token = jwt.sign(
    { role: "admin", email: normalized },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

  return { ok: true, token, email: normalized };
}

export function requireAdmin(req, res, next) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

  if (!token || !getJwtSecret()) {
    res.status(401).json({ message: "Failed", error: "Unauthorized." });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload?.role !== "admin") {
      res.status(401).json({ message: "Failed", error: "Unauthorized." });
      return;
    }
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ message: "Failed", error: "Unauthorized." });
  }
}

function sanitizeEvent(body) {
  const type = String(body?.type || "").trim();
  if (!EVENT_TYPES.has(type)) return null;

  const sessionId = String(body?.sessionId || "").trim().slice(0, 80);
  if (!sessionId) return null;

  const pathValue = String(body?.path || "/").trim().slice(0, 300) || "/";
  const section = String(body?.section || "").trim().slice(0, 120);
  const label = String(body?.label || "").trim().slice(0, 120);
  const referrer = String(body?.referrer || "").trim().slice(0, 400);
  const viewport = ["mobile", "tablet", "desktop"].includes(body?.viewport)
    ? body.viewport
    : "desktop";

  return {
    ts: new Date().toISOString(),
    type,
    sessionId,
    path: pathValue,
    section: section || undefined,
    label: label || undefined,
    referrer: referrer || undefined,
    viewport,
    utmSource: String(body?.utmSource || "").trim().slice(0, 80) || undefined,
    utmMedium: String(body?.utmMedium || "").trim().slice(0, 80) || undefined,
    utmCampaign: String(body?.utmCampaign || "").trim().slice(0, 80) || undefined,
  };
}

export async function appendAnalyticsEvent(dataDir, body) {
  const event = sanitizeEvent(body);
  if (!event) {
    return { ok: false, error: "Invalid analytics event." };
  }

  // Keep raw IP only when ZoomInfo enrichment is enabled; never expose it in admin UI.
  const clientIp = String(body?.clientIp || "").trim().slice(0, 64);
  if (clientIp && process.env.ZOOMINFO_USERNAME && process.env.ZOOMINFO_PASSWORD) {
    event.hasIp = true;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const file = path.join(dataDir, "analytics-events.jsonl");
  await fs.appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
  return { ok: true, event };
}

async function readEvents(dataDir, sinceMs) {
  const file = path.join(dataDir, "analytics-events.jsonl");
  let raw = "";
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const events = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      const ts = Date.parse(parsed.ts);
      if (!Number.isFinite(ts) || ts < sinceMs) continue;
      events.push(parsed);
    } catch {
      // skip corrupt lines
    }
  }
  return events;
}

function topCounts(items, key, limit = 8) {
  const map = new Map();
  for (const item of items) {
    const value = String(item[key] || "").trim();
    if (!value) continue;
    map.set(value, (map.get(value) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

function uniqueSessionCounts(items, key, limit = 8) {
  const map = new Map();
  for (const item of items) {
    const value = String(item[key] || "").trim();
    if (!value || !item.sessionId) continue;
    if (!map.has(value)) map.set(value, new Set());
    map.get(value).add(item.sessionId);
  }
  return [...map.entries()]
    .map(([name, set]) => ({ name, count: set.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function dayKey(iso) {
  return String(iso || "").slice(0, 10);
}

export async function buildAnalyticsOverview(dataDir, rangeKey = "7d") {
  const days = RANGE_DAYS[rangeKey] || 7;
  const sinceMs = Date.now() - days * 24 * 60 * 60 * 1000;
  const events = await readEvents(dataDir, sinceMs);

  const sessions = new Set(events.map((e) => e.sessionId).filter(Boolean));
  const pageViews = events.filter((e) => e.type === "page_view");
  const sectionViews = events.filter((e) => e.type === "section_view");
  const ctaClicks = events.filter((e) => e.type === "cta_click");
  const discovery = events.filter((e) => e.type === "discovery_submit");
  const newsletter = events.filter((e) => e.type === "newsletter_subscribe");

  const sessionsWithPage = new Set(pageViews.map((e) => e.sessionId));
  const pageCountBySession = new Map();
  for (const event of pageViews) {
    pageCountBySession.set(
      event.sessionId,
      (pageCountBySession.get(event.sessionId) || 0) + 1,
    );
  }
  let bounced = 0;
  for (const count of pageCountBySession.values()) {
    if (count <= 1) bounced += 1;
  }

  const byDayMap = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    byDayMap.set(key, {
      date: key,
      visitors: new Set(),
      pageViews: 0,
      sectionViews: 0,
      ctaClicks: 0,
      conversions: 0,
    });
  }
  for (const event of events) {
    const key = dayKey(event.ts);
    const bucket = byDayMap.get(key);
    if (!bucket) continue;
    if (event.sessionId) bucket.visitors.add(event.sessionId);
    if (event.type === "page_view") bucket.pageViews += 1;
    if (event.type === "section_view") bucket.sectionViews += 1;
    if (event.type === "cta_click") bucket.ctaClicks += 1;
    if (event.type === "discovery_submit" || event.type === "newsletter_subscribe") {
      bucket.conversions += 1;
    }
  }

  const byDay = [...byDayMap.values()].map((row) => ({
    date: row.date,
    visitors: row.visitors.size,
    pageViews: row.pageViews,
    sectionViews: row.sectionViews,
    ctaClicks: row.ctaClicks,
    conversions: row.conversions,
    conversionRate:
      row.visitors.size === 0
        ? 0
        : Math.round((row.conversions / row.visitors.size) * 1000) / 10,
  }));

  const hourFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: ANALYTICS_TIME_ZONE,
  });
  const byHourBuckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    visitors: new Set(),
    pageViews: 0,
  }));
  for (const event of events) {
    const ts = new Date(event.ts);
    if (Number.isNaN(ts.getTime())) continue;
    const hour = Number(hourFormatter.format(ts)) % 24;
    const bucket = byHourBuckets[hour];
    if (event.sessionId) bucket.visitors.add(event.sessionId);
    if (event.type === "page_view") bucket.pageViews += 1;
  }
  const byHour = byHourBuckets.map((row) => ({
    hour: row.hour,
    label: `${String(row.hour).padStart(2, "0")}:00`,
    visitors: row.visitors.size,
    pageViews: row.pageViews,
  }));

  const sessionsBySection = new Map();
  for (const event of sectionViews) {
    if (!event.section || !event.sessionId) continue;
    if (!sessionsBySection.has(event.section)) {
      sessionsBySection.set(event.section, new Set());
    }
    sessionsBySection.get(event.section).add(event.sessionId);
  }
  const sectionReach = HOME_SECTION_ORDER.map(({ id, label }) => {
    const reached = sessionsBySection.get(id)?.size || 0;
    return {
      section: label,
      visitors: reached,
      reachRate:
        sessions.size === 0 ? 0 : Math.round((reached / sessions.size) * 1000) / 10,
    };
  });

  const sessionSpan = new Map();
  for (const event of events) {
    if (!event.sessionId) continue;
    const ts = Date.parse(event.ts);
    if (!Number.isFinite(ts)) continue;
    const span = sessionSpan.get(event.sessionId);
    if (!span) sessionSpan.set(event.sessionId, { first: ts, last: ts });
    else {
      span.first = Math.min(span.first, ts);
      span.last = Math.max(span.last, ts);
    }
  }
  const durations = [...sessionSpan.values()].map((s) => (s.last - s.first) / 1000);
  const avgSessionSeconds =
    durations.length === 0
      ? 0
      : Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length);
  const sessionLengthBuckets = SESSION_LENGTH_BUCKETS.map((bucket) => ({
    bucket: bucket.label,
    sessions: durations.filter((d) => d >= bucket.min && d < bucket.max).length,
  }));

  const conversionsTotal = discovery.length + newsletter.length;

  return {
    range: `${days}d`,
    generatedAt: new Date().toISOString(),
    kpis: {
      visitors: sessions.size,
      pageViews: pageViews.length,
      sectionViews: sectionViews.length,
      ctaClicks: ctaClicks.length,
      discoverySubmits: discovery.length,
      newsletterSubscribes: newsletter.length,
      bounceRate:
        sessionsWithPage.size === 0
          ? 0
          : Math.round((bounced / sessionsWithPage.size) * 100),
      avgSessionSeconds,
      pagesPerSession:
        sessionsWithPage.size === 0
          ? 0
          : Math.round((pageViews.length / sessionsWithPage.size) * 10) / 10,
      conversionRate:
        sessions.size === 0
          ? 0
          : Math.round((conversionsTotal / sessions.size) * 1000) / 10,
    },
    timeZone: ANALYTICS_TIME_ZONE,
    byDay,
    byHour,
    sectionReach,
    sessionLengthBuckets,
    topPages: topCounts(pageViews, "path"),
    topSections: topCounts(sectionViews, "section"),
    topCtas: topCounts(ctaClicks, "label"),
    devices: uniqueSessionCounts(events, "viewport"),
    referrers: topCounts(
      events.filter((e) => e.referrer),
      "referrer",
      6,
    ),
    utmSources: uniqueSessionCounts(
      events.filter((e) => e.utmSource),
      "utmSource",
      6,
    ),
    recentEvents: events.slice(-25).reverse(),
  };
}
