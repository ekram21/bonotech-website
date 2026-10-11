import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { FormEventHandler, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { trackDiscoverySubmit } from "@/lib/analytics";
import {
    EmailSendError,
    isValidEmail,
    sendDiscoveryCallEmail,
} from "@/lib/services/email";
import FlowBackground from "./Hero/FlowBackground";
import {
    DAY,
    SCHEDULE,
    TIME_ZONES,
    buildSchedule,
    calendarDay,
    clampDay,
    currentTime,
    dayKey,
    formatDay,
    formatSlotRange,
    formatSlotTime,
    pageRange,
    rangeHeading,
    shiftMonth,
    weekStart,
    zoneLabel,
    zoneOptionLabel,
} from "./discoverySchedule";
import type { CalendarView, ClockFormat, Schedule } from "./discoverySchedule";
import "./discovery.css";

type FormValues = {
    fullName: string;
    email: string;
    company: string;
    companySize: string;
    role: string;
    website: string;
    focus: string;
    brief: string;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName | "slot", string>>;

const EMPTY_FORM: FormValues = {
    fullName: "",
    email: "",
    company: "",
    companySize: "",
    role: "",
    website: "",
    focus: "",
    brief: "",
};

/** Order matters: the first invalid field in this list receives focus on submit. */
const VALIDATED_FIELDS: FieldName[] = [
    "fullName",
    "email",
    "company",
    "companySize",
    "website",
    "focus",
];

const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d{1,5})?(\/\S*)?$/i;

const validateFields = (form: FormValues): FieldErrors => {
    const errors: FieldErrors = {};
    const name = form.fullName.trim();
    const email = form.email.trim();
    const website = form.website.trim();

    if (!name) errors.fullName = "Please enter your full name.";
    else if (name.length < 2) errors.fullName = "Name looks too short.";

    if (!email) errors.email = "Please enter your work email.";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

    if (!form.company.trim()) errors.company = "Please enter your company name.";
    if (!form.companySize) errors.companySize = "Please select your team size.";
    if (website && !WEBSITE_RE.test(website))
        errors.website = "Please enter a valid website, e.g. company.com.";
    if (!form.focus) errors.focus = "Please choose what we can help with.";

    return errors;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const firstSlotDay = (schedule: Schedule, zone: string) =>
    schedule.slots.length ? calendarDay(schedule.slots[0], zone) : schedule.today;

const DiscoveryCallSection = () => {
    const browserTimeZone = useMemo(
        () => Intl.DateTimeFormat().resolvedOptions().timeZone || SCHEDULE.hostZone,
        [],
    );

    const timeZones = useMemo(
        () => Array.from(new Set([browserTimeZone, ...TIME_ZONES])),
        [browserTimeZone],
    );

    const [form, setForm] = useState<FormValues>(EMPTY_FORM);
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const [calendarView, setCalendarView] = useState<CalendarView>("week");
    const [clockFormat, setClockFormat] = useState<ClockFormat>("12");
    const [timeZone, setTimeZone] = useState(browserTimeZone);

    // Re-evaluate "now" periodically so slots inside the notice window drop out while the page is open.
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 30_000);
        return () => window.clearInterval(id);
    }, []);

    const schedule = useMemo(() => buildSchedule(now, timeZone), [now, timeZone]);

    const [cursor, setCursor] = useState(() => firstSlotDay(schedule, timeZone));
    const [selectedDay, setSelectedDay] = useState(cursor);
    const [pickedTime, setPickedTime] = useState<number | null>(null);
    const [scrollRequest, setScrollRequest] = useState<{
        day: number | null;
        focusDate: boolean;
    } | null>(null);
    const [showReview, setShowReview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const datesRef = useRef<HTMLDivElement>(null);
    const slotListRef = useRef<HTMLDivElement>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);
    const focusAfterCloseRef = useRef<HTMLElement | null>(null);
    const reviewDialogRef = useRef<HTMLDialogElement>(null);
    const successDialogRef = useRef<HTMLDialogElement>(null);
    const gestureRef = useRef<{ x: number; y: number } | null>(null);
    const swipedRef = useRef(false);
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [submitMessage, setSubmitMessage] = useState("");
    const [confirmedSummary, setConfirmedSummary] = useState<{
        name: string;
        dateLabel: string;
        time: string;
        timeZone: string;
    } | null>(null);

    // A picked slot that has left the bookable window is treated as unselected.
    const selectedTime =
        pickedTime !== null && schedule.slots.includes(pickedTime) ? pickedTime : null;
    const selectedTimeDay =
        selectedTime !== null ? calendarDay(selectedTime, timeZone) : null;

    const { start: rangeStart, end: rangeEnd } = pageRange(cursor, calendarView);
    const canGoPrevious = rangeStart > schedule.today;
    const canGoNext = rangeEnd < schedule.lastDay;
    const focusableDay =
        selectedDay >= rangeStart && selectedDay <= rangeEnd
            ? selectedDay
            : Math.max(rangeStart, schedule.today);

    const calendarDays = useMemo(() => {
        const days: number[] = [];
        for (let day = rangeStart; day <= rangeEnd; day += DAY) days.push(day);
        return days;
    }, [rangeStart, rangeEnd]);
    const leadingBlanks =
        calendarView === "month" ? (rangeStart - weekStart(rangeStart)) / DAY : 0;

    const slotWeekStart = weekStart(cursor);
    const slotDays = Array.from({ length: 7 }, (_, index) => slotWeekStart + index * DAY);

    useEffect(() => {
        if (!scrollRequest) return;
        const list = slotListRef.current;

        if (list && scrollRequest.day === null) {
            list.scrollTop = 0;
        } else if (list && scrollRequest.day !== null) {
            const row = list.querySelector<HTMLElement>(
                `[data-day="${dayKey(scrollRequest.day)}"]`,
            );
            if (row) {
                list.scrollTo({
                    top:
                        row.getBoundingClientRect().top -
                        list.getBoundingClientRect().top +
                        list.scrollTop -
                        1,
                    behavior: "instant",
                });
            }
        }

        if (scrollRequest.focusDate && scrollRequest.day !== null) {
            datesRef.current
                ?.querySelector<HTMLElement>(`[data-date="${dayKey(scrollRequest.day)}"]`)
                ?.focus({ preventScroll: true });
        }
    }, [scrollRequest]);

    const isSelectedSlotValid = selectedTime !== null;

    const errors = useMemo<FieldErrors>(() => {
        const next = validateFields(form);
        if (!isSelectedSlotValid) {
            next.slot = "Choose a preferred time to review your call details.";
        }
        return next;
    }, [form, isSelectedSlotValid]);

    const isFormValid = Object.keys(errors).length === 0;

    const visibleError = (field: FieldName | "slot") =>
        field === "slot"
            ? submitAttempted
                ? errors.slot
                : undefined
            : submitAttempted || touched[field]
              ? errors[field]
              : undefined;

    const fieldA11y = (field: FieldName) => {
        const message = visibleError(field);
        return {
            "aria-invalid": message ? true : undefined,
            "aria-describedby": message ? `discovery-${field}-error` : undefined,
            onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
        } as const;
    };

    const renderFieldError = (field: FieldName) => {
        const message = visibleError(field);
        return message ? (
            <span id={`discovery-${field}-error`} className="discovery-field-error">
                {message}
            </span>
        ) : null;
    };

    const updateField = (field: FieldName, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const chooseDay = (day: number, focusDate = false, source: Schedule = schedule) => {
        const next = clampDay(day, source);
        setSelectedDay(next);
        setCursor(next);
        if (selectedTimeDay !== null && selectedTimeDay !== next) setPickedTime(null);
        setScrollRequest({ day: next, focusDate });
    };

    const changePage = (direction: 1 | -1) => {
        if ((direction < 0 && !canGoPrevious) || (direction > 0 && !canGoNext)) return;
        setCursor(
            clampDay(
                calendarView === "week"
                    ? cursor + direction * 7 * DAY
                    : shiftMonth(cursor, direction),
                schedule,
            ),
        );
        setScrollRequest({ day: null, focusDate: false });
    };

    const goToToday = () => {
        const fresh = Date.now();
        const freshSchedule = buildSchedule(fresh, timeZone);
        setNow(fresh);
        chooseDay(freshSchedule.today, false, freshSchedule);
    };

    const changeZone = (zone: string) => {
        const fresh = Date.now();
        const freshSchedule = buildSchedule(fresh, zone);
        const day =
            selectedTime !== null
                ? calendarDay(selectedTime, zone)
                : clampDay(selectedDay, freshSchedule);
        setNow(fresh);
        setTimeZone(zone);
        setSelectedDay(day);
        setCursor(day);
        setScrollRequest({ day, focusDate: false });
    };

    const selectSlot = (instant: number, day: number) => {
        setPickedTime(instant);
        setSelectedDay(day);
        setCursor(day);
    };

    const handleDatesKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-date]");
        if (!target?.dataset.date || event.altKey || event.ctrlKey || event.metaKey)
            return;

        const day = Date.parse(target.dataset.date);
        const destinations: Record<string, number> = {
            ArrowLeft: day - DAY,
            ArrowRight: day + DAY,
            ArrowUp: day - 7 * DAY,
            ArrowDown: day + 7 * DAY,
            Home: weekStart(day),
            End: weekStart(day) + 6 * DAY,
            PageUp: shiftMonth(day, -1),
            PageDown: shiftMonth(day, 1),
        };
        if (!(event.key in destinations)) return;

        event.preventDefault();
        chooseDay(destinations[event.key], true);
    };

    const handleDatesPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        gestureRef.current =
            event.pointerType !== "mouse" ? { x: event.clientX, y: event.clientY } : null;
        swipedRef.current = false;
    };

    const handleDatesPointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const gesture = gestureRef.current;
        if (!gesture) return;
        gestureRef.current = null;

        const dx = event.clientX - gesture.x;
        const dy = event.clientY - gesture.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            swipedRef.current = true;
            // Let the browser finish the touch sequence before replacing its target.
            requestAnimationFrame(() => changePage(dx < 0 ? 1 : -1));
        }
    };

    const handleDatesClickCapture = (event: MouseEvent<HTMLDivElement>) => {
        if (!swipedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        swipedRef.current = false;
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!isFormValid) {
            const firstInvalid = VALIDATED_FIELDS.find((field) => errors[field]);
            if (firstInvalid) {
                const element = formRef.current?.elements.namedItem(firstInvalid);
                if (element instanceof HTMLElement) element.focus();
            } else {
                slotListRef.current?.querySelector("button")?.focus();
            }
            return;
        }

        returnFocusRef.current = document.activeElement as HTMLElement | null;
        setSubmitState("idle");
        setSubmitMessage("");
        setShowReview(true);
    };

    const resetForm = (fresh: number) => {
        const freshSchedule = buildSchedule(fresh, browserTimeZone);
        const day = firstSlotDay(freshSchedule, browserTimeZone);

        setForm(EMPTY_FORM);
        setTouched({});
        setSubmitAttempted(false);
        setNow(fresh);
        setTimeZone(browserTimeZone);
        setSelectedDay(day);
        setCursor(day);
        setPickedTime(null);
        setSubmitMessage("");
    };

    const closeReview = (focusTarget: HTMLElement | null = returnFocusRef.current) => {
        if (submitState === "submitting") return;
        focusAfterCloseRef.current = focusTarget;
        setShowReview(false);
        setSubmitState("idle");
        setSubmitMessage("");
    };

    const editDetails = () => {
        const fullName = formRef.current?.elements.namedItem("fullName");
        closeReview(fullName instanceof HTMLElement ? fullName : null);
    };

    const selectedDateLabel =
        selectedTimeDay !== null
            ? formatDay(selectedTimeDay, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
              })
            : "";
    const selectedTimeLabel =
        selectedTime !== null ? formatSlotRange(selectedTime, timeZone, clockFormat) : "";

    const handleConfirmBooking = async () => {
        if (submitState === "submitting") return;

        if (!isFormValid || selectedTime === null || selectedTimeDay === null) {
            setSubmitState("error");
            setSubmitMessage(
                errors.slot
                    ? "That time is no longer available. Please edit your details and pick another slot."
                    : "Some details need attention. Please edit your details and try again.",
            );
            return;
        }

        setSubmitState("submitting");
        setSubmitMessage("");

        const trimmed = Object.fromEntries(
            Object.entries(form).map(([key, value]) => [key, value.trim()]),
        ) as FormValues;

        try {
            await sendDiscoveryCallEmail({
                ...trimmed,
                date: dayKey(selectedTimeDay),
                dateLabel: selectedDateLabel,
                time: selectedTimeLabel,
                timeZone,
                durationMinutes: SCHEDULE.duration,
            });
            trackDiscoverySubmit();

            setConfirmedSummary({
                name: trimmed.fullName,
                dateLabel: selectedDateLabel,
                time: selectedTimeLabel,
                timeZone: zoneLabel(timeZone),
            });
            setShowReview(false);
            setShowSuccess(true);
            setSubmitState("success");
            resetForm(currentTime());
        } catch (error) {
            setSubmitState("error");
            setSubmitMessage(
                error instanceof EmailSendError
                    ? error.message
                    : "Could not submit the discovery call request. Please try again.",
            );
        }
    };

    const closeSuccess = () => {
        focusAfterCloseRef.current = returnFocusRef.current;
        setShowSuccess(false);
        setConfirmedSummary(null);
        setSubmitState("idle");
    };

    const isSuccessOpen = showSuccess && confirmedSummary !== null;

    useEffect(() => {
        const review = reviewDialogRef.current;
        const success = successDialogRef.current;

        if (review && showReview && !review.open) review.showModal();
        if (review && !showReview && review.open) review.close();
        if (success && isSuccessOpen && !success.open) success.showModal();
        if (success && !isSuccessOpen && success.open) success.close();

        if (!showReview && !isSuccessOpen && focusAfterCloseRef.current) {
            focusAfterCloseRef.current.focus();
            focusAfterCloseRef.current = null;
        }

        document.documentElement.classList.toggle(
            "discovery-review-open",
            showReview || isSuccessOpen,
        );
    }, [showReview, isSuccessOpen]);

    useEffect(
        () => () => document.documentElement.classList.remove("discovery-review-open"),
        [],
    );

    const reviewEntries = [
        ["Date", selectedDateLabel],
        ["Time", selectedTimeLabel && `${selectedTimeLabel} (${zoneLabel(timeZone)})`],
        ["Name", form.fullName.trim()],
        ["Work email", form.email.trim()],
        ["Company", form.company.trim()],
        ["Company size", form.companySize],
        ["Role", form.role.trim()],
        ["Website", form.website.trim()],
        ["Focus", form.focus],
        ["Your brief", form.brief.trim()],
    ].filter(([, value]) => value);

    const selectedTimeSummary =
        selectedTime !== null && selectedTimeDay !== null
            ? `Preferred: ${formatDay(selectedTimeDay, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })} · ${selectedTimeLabel} · ${zoneLabel(timeZone)}`
            : "Select a date and time above.";

    return (
        <>
            <section
                id="discovery-call"
                className="discovery"
                aria-labelledby="discovery-title"
            >
                <div className="discovery-atmosphere" aria-hidden="true">
                    <FlowBackground
                        className="discovery-flow"
                        maxPixelRatio={1}
                        ringCenterY={0.43}
                        initialElapsed={4}
                    />
                </div>

                <header className="discovery-heading">
                    <p className="discovery-eyebrow">SCHEDULE A FREE DISCOVERY CALL</p>
                    <h2 id="discovery-title">
                        Turn Your Next Challenge
                        <span>Into a Clear Build Plan</span>
                    </h2>
                    <p className="discovery-description">
                        Tell us what’s slowing your business down, or what you want to
                        build next. <br className="hidden sm:block" />
                        Let’s map the opportunity, explore the right approach, and
                        define your next step.
                    </p>
                </header>

                <form
                    ref={formRef}
                    className="discovery-booking"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="discovery-details">
                        <div className="discovery-panel-heading">
                            <span className="discovery-step">01</span>
                            <div>
                                <h3>A Little About Your Business</h3>
                                <p>
                                    Give us the context to make our first conversation
                                    count.
                                </p>
                            </div>
                        </div>

                        <div className="discovery-fields">
                            <label>
                                Full name <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.fullName}
                                    onChange={(e) =>
                                        updateField("fullName", e.target.value)
                                    }
                                    name="fullName"
                                    autoComplete="name"
                                    placeholder="Alex Morgan"
                                    maxLength={100}
                                    {...fieldA11y("fullName")}
                                />
                                {renderFieldError("fullName")}
                            </label>

                            <label>
                                Work email <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="alex@company.com"
                                    maxLength={254}
                                    {...fieldA11y("email")}
                                />
                                {renderFieldError("email")}
                            </label>

                            <label>
                                Company name <span aria-hidden="true">*</span>
                                <input
                                    required
                                    value={form.company}
                                    onChange={(e) =>
                                        updateField("company", e.target.value)
                                    }
                                    name="company"
                                    autoComplete="organization"
                                    placeholder="Your company"
                                    maxLength={160}
                                    {...fieldA11y("company")}
                                />
                                {renderFieldError("company")}
                            </label>

                            <label>
                                Company size <span aria-hidden="true">*</span>
                                <select
                                    required
                                    value={form.companySize}
                                    onChange={(e) =>
                                        updateField("companySize", e.target.value)
                                    }
                                    name="companySize"
                                    {...fieldA11y("companySize")}
                                >
                                    <option value="">Select team size</option>
                                    <option>1–10 people</option>
                                    <option>11–50 people</option>
                                    <option>51–200 people</option>
                                    <option>201–500 people</option>
                                    <option>501–1,000 people</option>
                                    <option>1,000+ people</option>
                                </select>
                                {renderFieldError("companySize")}
                            </label>

                            <label>
                                Your role <small>Optional</small>
                                <input
                                    value={form.role}
                                    onChange={(e) => updateField("role", e.target.value)}
                                    name="role"
                                    autoComplete="organization-title"
                                    placeholder="Founder, product lead…"
                                    maxLength={120}
                                />
                            </label>

                            <label>
                                Company website <small>Optional</small>
                                <input
                                    value={form.website}
                                    onChange={(e) =>
                                        updateField("website", e.target.value)
                                    }
                                    name="website"
                                    inputMode="url"
                                    autoComplete="url"
                                    placeholder="company.com"
                                    maxLength={250}
                                    {...fieldA11y("website")}
                                />
                                {renderFieldError("website")}
                            </label>

                            <label className="discovery-field-wide">
                                What can we help with? <span aria-hidden="true">*</span>
                                <select
                                    required
                                    value={form.focus}
                                    onChange={(e) => updateField("focus", e.target.value)}
                                    name="focus"
                                    {...fieldA11y("focus")}
                                >
                                    <option value="">Choose your starting point</option>
                                    <option>Shape an idea and build a plan</option>
                                    <option>Build a website, mobile or web app</option>
                                    <option>Review our technology and delivery</option>
                                    <option>
                                        Digitize and connect enterprise systems
                                    </option>
                                    <option>Apply AI or automate workflows</option>
                                    <option>Help me find the right approach</option>
                                </select>
                                {renderFieldError("focus")}
                            </label>

                            <label className="discovery-field-wide">
                                What would success look like?{" "}
                                <small>Optional</small>
                                <textarea
                                    value={form.brief}
                                    onChange={(e) => updateField("brief", e.target.value)}
                                    name="brief"
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="The challenge, who it affects, and what you’d like to change…"
                                />
                            </label>
                        </div>

                        <p className="discovery-form-note">
                            A focused conversation about your business. No preparation
                            needed.
                            <br />
                            <span>Fields marked * are required.</span>
                        </p>
                    </div>

                    <div className="discovery-schedule">
                        <div className="discovery-panel-heading">
                            <span className="discovery-step">02</span>
                            <div>
                                <h3>Find a Time That Works</h3>
                                <p>
                                    <span className="discovery-duration">
                                        30-minute discovery call
                                    </span>{" "}
                                    · Online
                                </p>
                            </div>
                        </div>

                        <div className="discovery-calendar">
                            <div className="discovery-calendar-toolbar">
                                <div
                                    className="discovery-view"
                                    role="group"
                                    aria-label="Calendar view"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("week")}
                                        aria-pressed={calendarView === "week"}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCalendarView("month")}
                                        aria-pressed={calendarView === "month"}
                                    >
                                        Monthly
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    className="discovery-today"
                                    onClick={goToToday}
                                >
                                    Today
                                </button>
                            </div>

                            <div className="discovery-calendar-heading">
                                <h4 id="discovery-month">
                                    {rangeHeading(rangeStart, rangeEnd)}
                                </h4>
                                <div>
                                    <button
                                        type="button"
                                        className="discovery-nav discovery-date-prev"
                                        onClick={() => changePage(-1)}
                                        disabled={!canGoPrevious}
                                        aria-label={`Previous ${calendarView}`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="m14 6-6 6 6 6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="discovery-nav discovery-date-next"
                                        onClick={() => changePage(1)}
                                        disabled={!canGoNext}
                                        aria-label={`Next ${calendarView}`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="m10 6 6 6-6 6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div
                                ref={datesRef}
                                className={`discovery-dates${
                                    calendarView === "month" ? " is-month" : ""
                                }`}
                                role="group"
                                aria-labelledby="discovery-month"
                                onKeyDown={handleDatesKeyDown}
                                onPointerDown={handleDatesPointerDown}
                                onPointerUp={handleDatesPointerUp}
                                onPointerCancel={() => {
                                    gestureRef.current = null;
                                }}
                                onClickCapture={handleDatesClickCapture}
                            >
                                {calendarView === "month" &&
                                    WEEKDAY_LABELS.map((name) => (
                                        <span
                                            key={name}
                                            className="discovery-weekday"
                                            aria-hidden="true"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                {Array.from({ length: leadingBlanks }, (_, index) => (
                                    <span
                                        key={`empty-${index}`}
                                        className="discovery-empty-date"
                                        aria-hidden="true"
                                    />
                                ))}
                                {calendarDays.map((day) => (
                                    <button
                                        key={day}
                                        type="button"
                                        className="discovery-date"
                                        data-date={dayKey(day)}
                                        disabled={
                                            day < schedule.today || day > schedule.lastDay
                                        }
                                        tabIndex={day === focusableDay ? 0 : -1}
                                        aria-pressed={day === selectedDay}
                                        aria-label={formatDay(day, {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                        aria-current={
                                            day === schedule.today ? "date" : undefined
                                        }
                                        onClick={() => chooseDay(day, true)}
                                    >
                                        {calendarView === "week" && (
                                            <small>
                                                {formatDay(day, { weekday: "short" })}
                                            </small>
                                        )}
                                        {new Date(day).getUTCDate()}
                                    </button>
                                ))}
                            </div>

                            <div className="discovery-schedule-options">
                                <label>
                                    Time zone
                                    <select
                                        id="discovery-zone"
                                        name="timeZone"
                                        value={timeZone}
                                        onChange={(e) => changeZone(e.target.value)}
                                    >
                                        {timeZones.map((zone) => (
                                            <option key={zone} value={zone}>
                                                {zoneOptionLabel(zone)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <div
                                    className="discovery-clock-format"
                                    role="group"
                                    aria-label="Time format"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("12")}
                                        aria-pressed={clockFormat === "12"}
                                    >
                                        12h
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setClockFormat("24")}
                                        aria-pressed={clockFormat === "24"}
                                    >
                                        24h
                                    </button>
                                </div>
                            </div>

                            <p className="discovery-preview-note">
                                Pick a preferred time and we’ll confirm it by email.
                            </p>

                            <div className="discovery-slots-header">
                                <h4 id="discovery-slot-range">
                                    {`${formatDay(slotWeekStart, {
                                        month: "short",
                                        day: "numeric",
                                    })} – ${formatDay(slotWeekStart + 6 * DAY, {
                                        month: "short",
                                        day: "numeric",
                                    })}`}
                                </h4>
                                <span>{SCHEDULE.duration} min</span>
                            </div>

                            <div
                                ref={slotListRef}
                                className="discovery-slot-list"
                                tabIndex={0}
                                role="group"
                                aria-labelledby="discovery-slot-range"
                                aria-describedby={
                                    visibleError("slot")
                                        ? "discovery-slot-error"
                                        : undefined
                                }
                            >
                                {slotDays.map((day) => {
                                    const times = schedule.byDay.get(day) ?? [];

                                    return (
                                        <div
                                            key={day}
                                            className="discovery-slot-day"
                                            data-day={dayKey(day)}
                                        >
                                            <h5>
                                                {`${
                                                    day === schedule.today
                                                        ? "Today"
                                                        : formatDay(day, {
                                                              weekday: "short",
                                                          })
                                                }, ${formatDay(day, {
                                                    month: "short",
                                                    day: "numeric",
                                                })}`}
                                            </h5>
                                            {times.length ? (
                                                <div className="discovery-slot-buttons">
                                                    {times.map((instant) => {
                                                        const time = formatSlotTime(
                                                            instant,
                                                            timeZone,
                                                            clockFormat,
                                                        );
                                                        return (
                                                            <button
                                                                key={instant}
                                                                type="button"
                                                                className="discovery-slot"
                                                                aria-pressed={
                                                                    instant ===
                                                                    selectedTime
                                                                }
                                                                aria-label={`${formatDay(
                                                                    day,
                                                                    {
                                                                        weekday: "long",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    },
                                                                )}, ${time}, ${timeZone}`}
                                                                onClick={() =>
                                                                    selectSlot(
                                                                        instant,
                                                                        day,
                                                                    )
                                                                }
                                                            >
                                                                {time}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="discovery-no-slots">
                                                    {day < schedule.today
                                                        ? "Date has passed"
                                                        : "No available times on this day"}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="discovery-selected" aria-live="polite">
                                {selectedTimeSummary}
                            </div>

                            {visibleError("slot") && (
                                <p
                                    id="discovery-slot-error"
                                    className="discovery-error"
                                    role="alert"
                                >
                                    {visibleError("slot")}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="discovery-submit"
                                aria-disabled={submitAttempted && !isFormValid}
                            >
                                <span>Review Call Details</span>
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M4 12h15m-6-6 6 6-6 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>

                <dialog
                    ref={reviewDialogRef}
                    className="discovery-review"
                    aria-labelledby="discovery-review-title"
                    aria-busy={submitState === "submitting"}
                    onCancel={(event) => {
                        event.preventDefault();
                        closeReview();
                    }}
                >
                    <button
                        type="button"
                        className="discovery-review-close"
                        onClick={() => closeReview()}
                        disabled={submitState === "submitting"}
                        aria-label="Close booking review"
                    >
                        ×
                    </button>
                    <p className="discovery-eyebrow">YOUR DISCOVERY CALL</p>
                    <h3 id="discovery-review-title">A Clear Starting Point</h3>
                    <p>Check your preferred time and business details.</p>
                    <dl className="discovery-review-details">
                        {reviewEntries.map(([name, value]) => (
                            <Fragment key={name}>
                                <dt>{name}</dt>
                                <dd>{value}</dd>
                            </Fragment>
                        ))}
                    </dl>
                    <div
                        className="discovery-review-status"
                        role={submitState === "error" ? "alert" : "status"}
                    >
                        {submitState === "error" ? (
                            <>
                                <strong>Your request was not sent.</strong>
                                <p>{submitMessage}</p>
                            </>
                        ) : submitState === "submitting" ? (
                            <>
                                <strong>Sending your request…</strong>
                                <p>Please keep this window open for a moment.</p>
                            </>
                        ) : (
                            <>
                                <strong>Nothing is sent until you confirm.</strong>
                                <p>We’ll follow up by email to confirm this time.</p>
                            </>
                        )}
                    </div>
                    <div className="discovery-review-actions">
                        <button
                            className="discovery-edit"
                            type="button"
                            onClick={editDetails}
                            disabled={submitState === "submitting"}
                        >
                            Edit Details
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmBooking}
                            disabled={submitState === "submitting"}
                        >
                            {submitState === "submitting"
                                ? "Sending Request…"
                                : "Confirm Discovery Call"}
                        </button>
                    </div>
                </dialog>

                <dialog
                    ref={successDialogRef}
                    className="discovery-review"
                    aria-labelledby="discovery-success-title"
                    onCancel={(event) => {
                        event.preventDefault();
                        closeSuccess();
                    }}
                >
                    {confirmedSummary && (
                        <>
                            <button
                                type="button"
                                className="discovery-review-close"
                                onClick={closeSuccess}
                                aria-label="Close success message"
                            >
                                ×
                            </button>
                            <p className="discovery-eyebrow">REQUEST RECEIVED</p>
                            <h3 id="discovery-success-title">
                                We’ll Confirm Your Time
                            </h3>
                            <p>
                                Thanks
                                {confirmedSummary.name
                                    ? `, ${confirmedSummary.name.split(/\s+/)[0]}`
                                    : ""}
                                . We received your preferred slot and will follow up by
                                email to confirm your discovery call.
                            </p>
                            <dl className="discovery-review-details">
                                <dt>Date</dt>
                                <dd>{confirmedSummary.dateLabel}</dd>
                                <dt>Time</dt>
                                <dd>{`${confirmedSummary.time} (${confirmedSummary.timeZone})`}</dd>
                            </dl>
                            <div className="discovery-review-actions">
                                <button type="button" onClick={closeSuccess}>
                                    Done
                                </button>
                            </div>
                        </>
                    )}
                </dialog>
            </section>
        </>
    );
};

export default DiscoveryCallSection;
