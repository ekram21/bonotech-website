const API_BASE =
  import.meta.env.VITE_EMAIL_API_BASE?.trim() ||
  (import.meta.env.DEV ? "" : "https://rpa.dekkoai.online/bonotech-api");

const SESSION_KEY = "bonotech_analytics_sid";
const SESSION_FLAG = "bonotech_analytics_started";

export type AnalyticsEventType =
  | "session_start"
  | "page_view"
  | "section_view"
  | "cta_click"
  | "discovery_submit"
  | "newsletter_subscribe";

type AnalyticsPayload = {
  type: AnalyticsEventType;
  path?: string;
  section?: string;
  label?: string;
};

function getViewport(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return `s_${Date.now().toString(36)}`;
  }
}

function readUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
    };
  } catch {
    return {};
  }
}

function shouldSkipTracking(pathname = window.location.pathname): boolean {
  return pathname.startsWith("/admin");
}

export function trackEvent(payload: AnalyticsPayload): void {
  if (typeof window === "undefined") return;
  if (shouldSkipTracking(payload.path || window.location.pathname)) return;

  const body = {
    type: payload.type,
    sessionId: getOrCreateSessionId(),
    path: payload.path || `${window.location.pathname}${window.location.hash || ""}`,
    section: payload.section,
    label: payload.label,
    referrer: document.referrer || undefined,
    viewport: getViewport(),
    ...readUtm(),
  };

  void fetch(`${API_BASE}/analytics/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // analytics must never break the site
  });
}

export function ensureSessionStarted(): void {
  if (typeof window === "undefined") return;
  if (shouldSkipTracking()) return;

  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    sessionStorage.setItem(SESSION_FLAG, "1");
  } catch {
    // continue and still emit once per load
  }

  trackEvent({ type: "session_start" });
}

export function trackPageView(path?: string): void {
  ensureSessionStarted();
  trackEvent({ type: "page_view", path });
}

export function trackSectionView(section: string): void {
  trackEvent({ type: "section_view", section });
}

export function trackCtaClick(label: string): void {
  trackEvent({ type: "cta_click", label });
}

export function trackDiscoverySubmit(): void {
  trackEvent({ type: "discovery_submit", label: "discovery_call" });
}

export function trackNewsletterSubscribe(): void {
  trackEvent({ type: "newsletter_subscribe", label: "footer_newsletter" });
}

const ADMIN_TOKEN_KEY = "bonotech_admin_token";

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<{ token: string; email: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    token?: string;
    email?: string;
  };

  if (!res.ok || !payload.token) {
    throw new Error(payload.error || "Invalid email or password.");
  }

  setAdminToken(payload.token);
  return { token: payload.token, email: payload.email || email };
}

export type AnalyticsOverview = {
  range: string;
  generatedAt: string;
  kpis: {
    visitors: number;
    pageViews: number;
    sectionViews: number;
    ctaClicks: number;
    discoverySubmits: number;
    newsletterSubscribes: number;
    bounceRate: number;
    avgSessionSeconds?: number;
    pagesPerSession?: number;
    conversionRate?: number;
  };
  timeZone?: string;
  byDay: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    sectionViews?: number;
    ctaClicks?: number;
    conversions?: number;
    conversionRate?: number;
  }>;
  byHour?: Array<{ hour: number; label: string; visitors: number; pageViews: number }>;
  sectionReach?: Array<{ section: string; visitors: number; reachRate: number }>;
  sessionLengthBuckets?: Array<{ bucket: string; sessions: number }>;
  topPages: Array<{ name: string; count: number }>;
  topSections: Array<{ name: string; count: number }>;
  topCtas: Array<{ name: string; count: number }>;
  devices: Array<{ name: string; count: number }>;
  referrers: Array<{ name: string; count: number }>;
  utmSources?: Array<{ name: string; count: number }>;
  recentEvents: Array<{
    ts: string;
    type: string;
    path?: string;
    section?: string;
    label?: string;
    viewport?: string;
  }>;
  zoominfo?: {
    product: string;
    scriptInstalled: boolean;
    websightsKeyPreview: string | null;
    trackedSurfaces: string[];
    dashboardUrl: string;
    dashboardHint: string;
    apiConfigured: boolean;
    enrichmentEnabled: boolean;
    enrichmentNote: string;
    matchedCompanyCount: number;
    matchedCompanies: Array<{
      name: string;
      count: number;
      website?: string;
      industry?: string;
      country?: string;
      lastSeen?: string;
    }>;
    recentMatches: Array<{
      ts: string;
      name: string;
      website?: string;
      industry?: string;
      country?: string;
      path?: string;
      employeeCount?: number;
    }>;
  };
};

export async function fetchAnalyticsOverview(
  range: string,
): Promise<AnalyticsOverview> {
  const token = getAdminToken();
  if (!token) throw new Error("Not signed in.");

  const res = await fetch(
    `${API_BASE}/admin/analytics/overview?range=${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const payload = (await res.json().catch(() => ({}))) as AnalyticsOverview & {
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    if (res.status === 401) clearAdminToken();
    throw new Error(payload.error || "Could not load analytics.");
  }

  return payload;
}
