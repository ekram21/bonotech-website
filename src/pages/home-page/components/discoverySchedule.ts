export type CalendarView = "week" | "month";
export type ClockFormat = "12" | "24";

export const DAY = 86_400_000;

export const currentTime = () => Date.now();
const MINUTE = 60_000;

/** Weekday slots between 10:30 and 15:00 host time, bookable 24h ahead, 60 days out. */
export const SCHEDULE = {
    hostZone: "Asia/Dhaka",
    duration: 30,
    horizon: 60,
    notice: DAY,
    firstSlotMinutes: 10 * 60 + 30,
    lastSlotMinutes: 15 * 60,
};

export const TIME_ZONES = [
    "Asia/Dhaka",
    "Asia/Kolkata",
    "Asia/Dubai",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland",
    "Europe/London",
    "Europe/Berlin",
    "Africa/Johannesburg",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Sao_Paulo",
    "UTC",
];

const formatters = new Map<string, Intl.DateTimeFormat>();
const getFormatter = (key: string, create: () => Intl.DateTimeFormat) => {
    let formatter = formatters.get(key);
    if (!formatter) {
        formatter = create();
        formatters.set(key, formatter);
    }
    return formatter;
};

const readParts = (formatter: Intl.DateTimeFormat, timestamp: number) =>
    Object.fromEntries(
        formatter.formatToParts(timestamp).map((part) => [part.type, part.value]),
    );

/** The calendar day (as a UTC-midnight timestamp) that `timestamp` falls on in `zone`. */
export const calendarDay = (timestamp: number, zone: string) => {
    const formatter = getFormatter(`day:${zone}`, () =>
        new Intl.DateTimeFormat("en-CA", {
            timeZone: zone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }),
    );
    const parts = readParts(formatter, timestamp);
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
};

export const dayKey = (day: number) => new Date(day).toISOString().slice(0, 10);

export const formatDay = (day: number, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(day);

export const weekStart = (day: number) =>
    day - ((new Date(day).getUTCDay() + 6) % 7) * DAY;

export const monthStart = (day: number) =>
    Date.UTC(new Date(day).getUTCFullYear(), new Date(day).getUTCMonth(), 1);

export const shiftMonth = (day: number, amount: number) => {
    const date = new Date(day);
    const lastDate = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount + 1, 0),
    ).getUTCDate();
    return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth() + amount,
        Math.min(date.getUTCDate(), lastDate),
    );
};

const instantInZone = (day: number, minutes: number, zone: string) => {
    const wanted = day + minutes * MINUTE;
    const formatter = getFormatter(`instant:${zone}`, () =>
        new Intl.DateTimeFormat("en-GB", {
            timeZone: zone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        }),
    );
    let instant = wanted;
    for (let pass = 0; pass < 3; pass++) {
        const parts = readParts(formatter, instant);
        const represented = Date.UTC(
            +parts.year,
            +parts.month - 1,
            +parts.day,
            +parts.hour,
            +parts.minute,
            +parts.second,
        );
        instant += wanted - represented;
    }
    return instant;
};

export type Schedule = {
    slots: number[];
    byDay: Map<number, number[]>;
    today: number;
    lastDay: number;
};

export const buildSchedule = (now: number, zone: string): Schedule => {
    const hostToday = calendarDay(now, SCHEDULE.hostZone);
    const slots: number[] = [];

    for (let offset = 0; offset <= SCHEDULE.horizon; offset++) {
        const day = hostToday + offset * DAY;
        if ([0, 6].includes(new Date(day).getUTCDay())) continue;
        for (
            let start = SCHEDULE.firstSlotMinutes;
            start <= SCHEDULE.lastSlotMinutes;
            start += SCHEDULE.duration
        ) {
            const instant = instantInZone(day, start, SCHEDULE.hostZone);
            if (instant >= now + SCHEDULE.notice) slots.push(instant);
        }
    }

    const byDay = new Map<number, number[]>();
    for (const instant of slots) {
        const day = calendarDay(instant, zone);
        const list = byDay.get(day);
        if (list) list.push(instant);
        else byDay.set(day, [instant]);
    }

    const today = calendarDay(now, zone);
    const lastDay = slots.length ? calendarDay(slots[slots.length - 1], zone) : today;

    return { slots, byDay, today, lastDay };
};

export const formatSlotTime = (instant: number, zone: string, clock: ClockFormat) =>
    getFormatter(`time:${zone}:${clock}`, () =>
        new Intl.DateTimeFormat("en-US", {
            timeZone: zone,
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: clock === "12" ? "h12" : "h23",
        }),
    )
        .format(instant)
        .replace(/^0(?=\d:)/, clock === "12" ? "" : "0");

export const formatSlotRange = (instant: number, zone: string, clock: ClockFormat) =>
    `${formatSlotTime(instant, zone, clock)}–${formatSlotTime(
        instant + SCHEDULE.duration * MINUTE,
        zone,
        clock,
    )}`;

export const zoneLabel = (zone: string) => zone.replaceAll("_", " ");

export const zoneOptionLabel = (zone: string) =>
    zone.replaceAll("_", " ").replaceAll("/", " / ");

export const pageRange = (cursor: number, view: CalendarView) => {
    const start = view === "week" ? weekStart(cursor) : monthStart(cursor);
    const end = view === "week" ? start + 6 * DAY : shiftMonth(start, 1) - DAY;
    return { start, end };
};

export const rangeHeading = (start: number, end: number) => {
    const startMonth = formatDay(start, { month: "long" });
    const endMonth = formatDay(end, { month: "long" });
    const sameYear = new Date(start).getUTCFullYear() === new Date(end).getUTCFullYear();

    if (startMonth === endMonth) return formatDay(start, { month: "long", year: "numeric" });
    if (sameYear)
        return `${formatDay(start, { month: "short" })} – ${formatDay(end, {
            month: "short",
            year: "numeric",
        })}`;
    return `${formatDay(start, { month: "short", year: "numeric" })} – ${formatDay(end, {
        month: "short",
        year: "numeric",
    })}`;
};

export const clampDay = (day: number, schedule: Schedule) =>
    Math.max(schedule.today, Math.min(schedule.lastDay, day));
