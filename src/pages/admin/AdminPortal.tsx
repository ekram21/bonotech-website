import { useCallback, useEffect, useState, type FormEvent } from "react";
import bonotechLogo from "@/assets/bonotech-logo-white.svg";
import {
  adminLogin,
  clearAdminToken,
  fetchAnalyticsOverview,
  getAdminToken,
  type AnalyticsOverview,
} from "@/lib/analytics";
import {
  CHART_COLORS,
  ChartPanel,
  ConversionTrendChart,
  EngagementTrendChart,
  HorizontalBarChart,
  TrafficByDayChart,
  VerticalBarChart,
} from "./AdminCharts";
import "./admin-portal.css";

const SHOW_ZOOMINFO_PANEL = false;

const RANGES = [
  { key: "1d", label: "24h" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
] as const;

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

export function AdminPortal() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()));
  const [email, setEmail] = useState("ekram@edutechs.app");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("7d");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadOverview = useCallback(async (selectedRange: string) => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchAnalyticsOverview(selectedRange);
      setOverview(data);
      setAuthed(true);
    } catch (error) {
      clearAdminToken();
      setAuthed(false);
      setOverview(null);
      setLoadError(
        error instanceof Error ? error.message : "Could not load analytics.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadOverview(range);
  }, [authed, range, loadOverview]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      await adminLogin(email.trim(), password);
      setPassword("");
      setAuthed(true);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Invalid email or password.",
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    setOverview(null);
  };

  if (!authed) {
    return (
      <div className="admin-shell admin-login-shell">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <img src={bonotechLogo} alt="Bonotech" className="admin-logo" />
          <h1>Admin portal</h1>
          <p>Sign in to review visitor analytics and KPI progress.</p>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {loginError ? <p className="admin-error">{loginError}</p> : null}
          <button type="submit" disabled={loggingIn}>
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  const kpis = overview?.kpis;

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div className="admin-brand">
          <img src={bonotechLogo} alt="" className="admin-logo-sm" />
          <div>
            <p className="admin-kicker">Bonotech</p>
            <h1>Analytics</h1>
          </div>
        </div>
        <div className="admin-top-actions">
          <div className="admin-range" role="tablist" aria-label="Date range">
            {RANGES.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={range === item.key}
                className={range === item.key ? "is-active" : undefined}
                onClick={() => setRange(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" className="admin-ghost" onClick={() => void loadOverview(range)}>
            Refresh
          </button>
          <button type="button" className="admin-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {loadError ? <p className="admin-error admin-banner">{loadError}</p> : null}
      {loading && !overview ? <p className="admin-muted">Loading analytics…</p> : null}

      {kpis ? (
        <>
          <section className="admin-kpi-grid" aria-label="Key metrics">
            <article>
              <span>Visitors</span>
              <strong>{formatNumber(kpis.visitors)}</strong>
            </article>
            <article>
              <span>Page views</span>
              <strong>{formatNumber(kpis.pageViews)}</strong>
            </article>
            <article>
              <span>Bounce rate</span>
              <strong>{kpis.bounceRate}%</strong>
            </article>
            <article>
              <span>CTA clicks</span>
              <strong>{formatNumber(kpis.ctaClicks)}</strong>
            </article>
            <article>
              <span>Discovery calls</span>
              <strong>{formatNumber(kpis.discoverySubmits)}</strong>
            </article>
            <article>
              <span>Newsletter</span>
              <strong>{formatNumber(kpis.newsletterSubscribes)}</strong>
            </article>
            <article>
              <span>Conversion rate</span>
              <strong>{kpis.conversionRate ?? 0}%</strong>
            </article>
            <article>
              <span>Avg. time on site</span>
              <strong>{formatDuration(kpis.avgSessionSeconds ?? 0)}</strong>
            </article>
            <article>
              <span>Pages / session</span>
              <strong>{kpis.pagesPerSession ?? 0}</strong>
            </article>
          </section>

          {SHOW_ZOOMINFO_PANEL && overview.zoominfo ? (
            <section className="admin-panel admin-panel-wide admin-zoominfo">
              <div className="admin-zoominfo-head">
                <div>
                  <h2>ZoomInfo WebSights</h2>
                  <p className="admin-muted admin-zoominfo-note">
                    {overview.zoominfo.enrichmentNote}
                  </p>
                </div>
                <a
                  className="admin-ghost admin-zoominfo-link"
                  href={overview.zoominfo.dashboardUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open ZoomInfo
                </a>
              </div>

              <div className="admin-zoominfo-status">
                <div>
                  <span>Script on site</span>
                  <strong>
                    {overview.zoominfo.scriptInstalled ? "Live" : "Missing"}
                  </strong>
                </div>
                <div>
                  <span>WebSights key</span>
                  <strong>{overview.zoominfo.websightsKeyPreview || "—"}</strong>
                </div>
                <div>
                  <span>API enrichment</span>
                  <strong>
                    {overview.zoominfo.enrichmentEnabled ? "Enabled" : "Not connected"}
                  </strong>
                </div>
                <div>
                  <span>Companies matched</span>
                  <strong>{formatNumber(overview.zoominfo.matchedCompanyCount || 0)}</strong>
                </div>
              </div>

              <p className="admin-muted">{overview.zoominfo.dashboardHint}</p>

              <div className="admin-zoominfo-surfaces">
                {overview.zoominfo.trackedSurfaces.map((url) => (
                  <span key={url}>{url}</span>
                ))}
              </div>

              <div className="admin-zoominfo-split">
                <div>
                  <h3>Top companies (enriched)</h3>
                  {overview.zoominfo.matchedCompanies.length === 0 ? (
                    <p className="admin-empty">
                      {overview.zoominfo.apiConfigured
                        ? "No company matches in this range yet."
                        : "Connect ZoomInfo API credentials to pull company matches into this portal."}
                    </p>
                  ) : (
                    <ul className="admin-rank">
                      {overview.zoominfo.matchedCompanies.map((row) => (
                        <li key={row.name}>
                          <span title={[row.name, row.industry, row.country].filter(Boolean).join(" · ")}>
                            {row.name}
                            {row.country ? ` · ${row.country}` : ""}
                          </span>
                          <strong>{formatNumber(row.count)}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3>Recent company visits</h3>
                  {overview.zoominfo.recentMatches.length === 0 ? (
                    <p className="admin-empty">
                      Company-level visits currently live in ZoomInfo WebSights Analytics.
                    </p>
                  ) : (
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>When</th>
                            <th>Company</th>
                            <th>Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.zoominfo.recentMatches.map((row, index) => (
                            <tr key={`${row.ts}-${row.name}-${index}`}>
                              <td>{formatWhen(row.ts)}</td>
                              <td>{row.name}</td>
                              <td>
                                {[row.industry, row.country, row.path]
                                  .filter(Boolean)
                                  .join(" · ") || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          <div className="admin-grid">
            <ChartPanel
              wide
              title="Traffic by day"
              subtitle="Unique visitors and total page views per day."
              isEmpty={overview.byDay.every((d) => d.visitors === 0 && d.pageViews === 0)}
              emptyText="No traffic in this range yet."
            >
              <TrafficByDayChart data={overview.byDay} />
            </ChartPanel>

            <ChartPanel
              title="Engagement trend"
              subtitle="Section views, CTA clicks and conversions per day."
              isEmpty={overview.byDay.every(
                (d) => !d.sectionViews && !d.ctaClicks && !d.conversions,
              )}
            >
              <EngagementTrendChart data={overview.byDay} />
            </ChartPanel>

            <ChartPanel
              title="Conversions"
              subtitle="Discovery calls + newsletter signups, and share of visitors converting."
              isEmpty={overview.byDay.every((d) => !d.conversions)}
              emptyText="No conversions in this range yet."
            >
              <ConversionTrendChart data={overview.byDay} />
            </ChartPanel>

            <ChartPanel
              wide
              title="Visitors by hour"
              subtitle={`When people visit, by hour of day (${overview.timeZone ?? "Asia/Dhaka"}).`}
              isEmpty={!overview.byHour || overview.byHour.every((h) => h.visitors === 0 && h.pageViews === 0)}
            >
              <VerticalBarChart
                data={overview.byHour ?? []}
                xKey="label"
                xLabel="Hour of day"
                yLabel="Count"
                series={[
                  { key: "visitors", name: "Visitors", color: CHART_COLORS.visitors },
                  { key: "pageViews", name: "Page views", color: CHART_COLORS.pageViews },
                ]}
              />
            </ChartPanel>

            <ChartPanel
              title="Homepage section reach"
              subtitle="How many visitors scrolled to each section, top to bottom."
              height={360}
              isEmpty={!overview.sectionReach || overview.sectionReach.every((s) => s.visitors === 0)}
            >
              <HorizontalBarChart
                data={overview.sectionReach ?? []}
                categoryKey="section"
                valueKey="visitors"
                valueName="Visitors reached"
                xLabel="Visitors"
                yLabel="Section"
                color={CHART_COLORS.sectionViews}
                extraTooltip={{ key: "reachRate", name: "of visitors", suffix: "%" }}
              />
            </ChartPanel>

            <ChartPanel
              title="Session length"
              subtitle="How long visitors stayed on the site."
              height={360}
              isEmpty={!overview.sessionLengthBuckets || overview.sessionLengthBuckets.every((b) => b.sessions === 0)}
            >
              <VerticalBarChart
                data={overview.sessionLengthBuckets ?? []}
                xKey="bucket"
                xLabel="Time on site"
                yLabel="Sessions"
                series={[{ key: "sessions", name: "Sessions", color: CHART_COLORS.visitors }]}
              />
            </ChartPanel>

            <ChartPanel
              title="Top CTAs"
              subtitle="Which buttons visitors click most."
              isEmpty={overview.topCtas.length === 0}
              emptyText="No CTA clicks yet."
            >
              <HorizontalBarChart
                data={overview.topCtas}
                categoryKey="name"
                valueKey="count"
                valueName="Clicks"
                xLabel="Clicks"
                yLabel="CTA"
                color={CHART_COLORS.ctaClicks}
              />
            </ChartPanel>

            <ChartPanel
              title="Devices"
              subtitle="Visitors by screen size."
              isEmpty={overview.devices.length === 0}
              emptyText="No device data yet."
            >
              <HorizontalBarChart
                data={overview.devices}
                categoryKey="name"
                valueKey="count"
                valueName="Visitors"
                xLabel="Visitors"
                yLabel="Device"
                color={CHART_COLORS.visitors}
              />
            </ChartPanel>

            <ChartPanel
              title="Top pages"
              subtitle="Most viewed pages and anchors."
              isEmpty={overview.topPages.length === 0}
              emptyText="No page views yet."
            >
              <HorizontalBarChart
                data={overview.topPages}
                categoryKey="name"
                valueKey="count"
                valueName="Page views"
                xLabel="Page views"
                yLabel="Page"
                color={CHART_COLORS.pageViews}
              />
            </ChartPanel>

            <ChartPanel
              title="Referrers"
              subtitle="Sites that sent visitors to Bonotech."
              isEmpty={overview.referrers.length === 0}
              emptyText="No referrers captured yet."
            >
              <HorizontalBarChart
                data={overview.referrers.map((r) => ({
                  ...r,
                  name: r.name.replace(/^https?:\/\//, "").replace(/\/$/, ""),
                }))}
                categoryKey="name"
                valueKey="count"
                valueName="Events"
                xLabel="Events"
                yLabel="Referrer"
                color={CHART_COLORS.conversions}
              />
            </ChartPanel>

            <ChartPanel
              wide
              title="Campaign sources"
              subtitle="Visitors arriving with a utm_source tag."
              isEmpty={!overview.utmSources || overview.utmSources.length === 0}
              emptyText="No tagged campaign traffic yet. Add ?utm_source=… to links you share."
            >
              <HorizontalBarChart
                data={overview.utmSources ?? []}
                categoryKey="name"
                valueKey="count"
                valueName="Visitors"
                xLabel="Visitors"
                yLabel="Source"
                color={CHART_COLORS.rate}
              />
            </ChartPanel>
          </div>

          <section className="admin-panel admin-panel-wide">
            <h2>Recent activity</h2>
            {overview.recentEvents.length === 0 ? (
              <p className="admin-empty">Waiting for the first visitor events.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Event</th>
                      <th>Detail</th>
                      <th>Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.recentEvents.map((event, index) => (
                      <tr key={`${event.ts}-${event.type}-${index}`}>
                        <td>{formatWhen(event.ts)}</td>
                        <td>{event.type}</td>
                        <td>
                          {event.label ||
                            event.section ||
                            event.path ||
                            "—"}
                        </td>
                        <td>{event.viewport || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {overview.generatedAt ? (
              <p className="admin-muted">
                Updated {formatWhen(overview.generatedAt)}
              </p>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}
