import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const CHART_COLORS = {
  visitors: "#8b5cf6",
  pageViews: "#c4b5fd",
  sectionViews: "#38bdf8",
  ctaClicks: "#f59e0b",
  conversions: "#34d399",
  rate: "#f472b6",
} as const;

const AXIS_TICK = { fill: "rgba(255,255,255,0.6)", fontSize: 11 };
const AXIS_LABEL_STYLE = { fill: "rgba(255,255,255,0.55)", fontSize: 11 };
const GRID_STROKE = "rgba(255,255,255,0.08)";
const TOOLTIP_PROPS = {
  contentStyle: {
    background: "#120a24",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 4,
    color: "#f9f7ff",
    fontSize: 12,
  },
  labelStyle: { color: "#f9f7ff", fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: "#e7e0f3" },
  cursor: { fill: "rgba(139,92,246,0.12)" },
};
const LEGEND_PROPS = {
  wrapperStyle: { fontSize: 12, color: "rgba(255,255,255,0.75)", paddingTop: 8 },
  iconType: "square" as const,
};

type Series = { key: string; name: string; color: string };

export function ChartPanel({
  title,
  subtitle,
  wide,
  isEmpty,
  emptyText = "No data in this range yet.",
  height = 280,
  children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  height?: number;
  children: ReactNode;
}) {
  return (
    <section className={`admin-panel${wide ? " admin-panel-wide" : ""}`}>
      <h2>{title}</h2>
      {subtitle ? <p className="admin-chart-subtitle">{subtitle}</p> : null}
      {isEmpty ? (
        <p className="admin-empty">{emptyText}</p>
      ) : (
        <div className="admin-chart" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function formatDay(value: string) {
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TrafficByDayChart({
  data,
}: {
  data: Array<{ date: string; visitors: number; pageViews: number }>;
}) {
  return (
    <BarChart data={data} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
      <CartesianGrid stroke={GRID_STROKE} vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={formatDay}
        tick={AXIS_TICK}
        label={{ value: "Date", position: "insideBottom", offset: -18, ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        allowDecimals={false}
        tick={AXIS_TICK}
        label={{ value: "Count", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
      />
      <Tooltip {...TOOLTIP_PROPS} labelFormatter={(v) => formatDay(String(v))} />
      <Legend {...LEGEND_PROPS} verticalAlign="top" />
      <Bar dataKey="visitors" name="Visitors" fill={CHART_COLORS.visitors} radius={[2, 2, 0, 0]} />
      <Bar dataKey="pageViews" name="Page views" fill={CHART_COLORS.pageViews} radius={[2, 2, 0, 0]} />
    </BarChart>
  );
}

export function EngagementTrendChart({
  data,
}: {
  data: Array<{
    date: string;
    sectionViews?: number;
    ctaClicks?: number;
    conversions?: number;
  }>;
}) {
  return (
    <LineChart data={data} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
      <CartesianGrid stroke={GRID_STROKE} vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={formatDay}
        tick={AXIS_TICK}
        label={{ value: "Date", position: "insideBottom", offset: -18, ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        allowDecimals={false}
        tick={AXIS_TICK}
        label={{ value: "Events", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
      />
      <Tooltip
        {...TOOLTIP_PROPS}
        cursor={{ stroke: "rgba(255,255,255,0.25)" }}
        labelFormatter={(v) => formatDay(String(v))}
      />
      <Legend {...LEGEND_PROPS} verticalAlign="top" iconType="plainline" />
      <Line type="monotone" dataKey="sectionViews" name="Section views" stroke={CHART_COLORS.sectionViews} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      <Line type="monotone" dataKey="ctaClicks" name="CTA clicks" stroke={CHART_COLORS.ctaClicks} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      <Line type="monotone" dataKey="conversions" name="Conversions" stroke={CHART_COLORS.conversions} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
    </LineChart>
  );
}

export function ConversionTrendChart({
  data,
}: {
  data: Array<{ date: string; visitors: number; conversions?: number; conversionRate?: number }>;
}) {
  return (
    <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
      <CartesianGrid stroke={GRID_STROKE} vertical={false} />
      <XAxis
        dataKey="date"
        tickFormatter={formatDay}
        tick={AXIS_TICK}
        label={{ value: "Date", position: "insideBottom", offset: -18, ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        yAxisId="count"
        allowDecimals={false}
        tick={AXIS_TICK}
        label={{ value: "Conversions", angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        yAxisId="rate"
        orientation="right"
        tick={AXIS_TICK}
        unit="%"
        label={{ value: "Conversion rate (%)", angle: 90, position: "insideRight", ...AXIS_LABEL_STYLE }}
      />
      <Tooltip
        {...TOOLTIP_PROPS}
        labelFormatter={(v) => formatDay(String(v))}
        formatter={(value, name) =>
          name === "Conversion rate" ? [`${value}%`, name] : [value, name]
        }
      />
      <Legend {...LEGEND_PROPS} verticalAlign="top" />
      <Bar yAxisId="count" dataKey="conversions" name="Conversions" fill={CHART_COLORS.conversions} radius={[2, 2, 0, 0]} />
      <Line yAxisId="rate" type="monotone" dataKey="conversionRate" name="Conversion rate" stroke={CHART_COLORS.rate} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
    </ComposedChart>
  );
}

export function VerticalBarChart({
  data,
  xKey,
  xLabel,
  yLabel,
  series,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  xLabel: string;
  yLabel: string;
  series: Series[];
}) {
  return (
    <BarChart data={data} margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
      <CartesianGrid stroke={GRID_STROKE} vertical={false} />
      <XAxis
        dataKey={xKey}
        tick={AXIS_TICK}
        interval="preserveStartEnd"
        label={{ value: xLabel, position: "insideBottom", offset: -18, ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        allowDecimals={false}
        tick={AXIS_TICK}
        label={{ value: yLabel, angle: -90, position: "insideLeft", ...AXIS_LABEL_STYLE }}
      />
      <Tooltip {...TOOLTIP_PROPS} />
      <Legend {...LEGEND_PROPS} verticalAlign="top" />
      {series.map((s) => (
        <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[2, 2, 0, 0]} />
      ))}
    </BarChart>
  );
}

export function HorizontalBarChart({
  data,
  categoryKey,
  valueKey,
  valueName,
  xLabel,
  yLabel,
  color,
  extraTooltip,
}: {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  valueKey: string;
  valueName: string;
  xLabel: string;
  yLabel: string;
  color: string;
  extraTooltip?: { key: string; name: string; suffix?: string };
}) {
  return (
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 8, right: 24, bottom: 28, left: 16 }}
    >
      <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
      <XAxis
        type="number"
        allowDecimals={false}
        tick={AXIS_TICK}
        label={{ value: xLabel, position: "insideBottom", offset: -18, ...AXIS_LABEL_STYLE }}
      />
      <YAxis
        type="category"
        dataKey={categoryKey}
        width={130}
        tick={AXIS_TICK}
        tickFormatter={(v: string) => (v.length > 20 ? `${v.slice(0, 19)}…` : v)}
        label={{ value: yLabel, angle: -90, position: "insideLeft", offset: -4, ...AXIS_LABEL_STYLE }}
      />
      <Tooltip
        {...TOOLTIP_PROPS}
        formatter={(value, name, item) => {
          if (extraTooltip && item?.payload?.[extraTooltip.key] !== undefined) {
            return [
              `${value} (${item.payload[extraTooltip.key]}${extraTooltip.suffix ?? ""} ${extraTooltip.name})`,
              name,
            ];
          }
          return [value, name];
        }}
      />
      <Legend {...LEGEND_PROPS} verticalAlign="top" />
      <Bar dataKey={valueKey} name={valueName} fill={color} radius={[0, 2, 2, 0]} />
    </BarChart>
  );
}
