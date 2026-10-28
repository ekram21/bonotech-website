/* Beam paths inspired by Dillion Verma's Animated Beam (Magic UI, MIT):
   https://21st.dev/@dillionverma/components/animated-beam */
import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";

import { trackCtaClick } from "@/lib/analytics";
import chatgptLogo from "@/assets/service-tiers/chatgpt.svg";
import claudeLogo from "@/assets/service-tiers/claude.svg";

import "./ServiceTiersSection.css";

type Tier = {
    tab: string;
    kicker: string;
    title: [string, string];
    body: string;
    example: string;
    relationship: string;
};

type BeamPath = {
    d: string;
    className?: string;
};

const ROTATION_DELAY_MS = 40000;
const SWIPE_DISTANCE = 50;

const tiers: Tier[] = [
    {
        tab: "MCP Access",
        kicker: "MCP ENABLEMENT",
        title: ["Let AI Work With", "Your Business"],
        body: "Ask ChatGPT, Claude or any compatible AI agent of your choice about your business Through MCP, we connect it to your AI harness (the layer bringing your business data together), so it can answer questions using your company’s documents, client emails and operational data\u2060—\u2060only from sources you’ve approved",
        example: "After integration, your team could ask: “How can we boost factory output?”",
        relationship: "Connect your preferred AI agent to your business context",
    },
    {
        tab: "AI Harness",
        kicker: "AI HARNESS",
        title: ["Turn Scattered Data", "Into A Shared View"],
        body: "We connect documents, operational data and client emails to a shared AI layer It processes incoming inquiries and requests, brings them into context, and surfaces useful information in your company’s CRM",
        example: "Your CRM is the workspace The harness powers the intelligence behind it",
        relationship: "Connects your CRM with the AI agents your team uses",
    },
    {
        tab: "CRMs",
        kicker: "CRMs",
        title: ["Your CRM, Updated", "As Business Happens"],
        body: "We build CRMs that bring customer activity and team updates into one real-time workspace Data analysis highlights patterns and suggests next actions, so your team can respond sooner",
        example: "Live updates from connected systems Suggestions for your team to review",
        relationship: "Connect to an AI harness for wider business context",
    },
    {
        tab: "Websites & Apps",
        kicker: "STANDALONE PRODUCTS",
        title: ["A Focused Product", "Built To Perform"],
        body: "Need a website or an app with a clear purpose? We design and build a complete, independent product around that need, ready for your customers to use",
        example: "A company website A booking app Your next digital product",
        relationship: "A complete standalone build, ready to use on its own",
    },
];

const pad = (value: number) => String(value).padStart(2, "0");

const BeamGradient = ({ index }: { index: number }) => (
    <defs>
        <linearGradient
            id={`tier-beam-ink-${index}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="500"
            y2="500"
        >
            <stop stopColor="#8150bf" />
            <stop offset=".5" stopColor="#eedcff" />
            <stop offset="1" stopColor="#b37beb" />
        </linearGradient>
    </defs>
);

const BeamPaths = ({
    index,
    paths,
    className = "tier-paths",
}: {
    index: number;
    paths: BeamPath[];
    className?: string;
}) => (
    <g className={className}>
        {paths.map((path, j) => (
            <Fragment key={path.d}>
                <path d={path.d} className={path.className} />
                <path
                    d={path.d}
                    className={[path.className, "tier-beam"].filter(Boolean).join(" ")}
                    pathLength={100}
                    style={
                        {
                            stroke: `url(#tier-beam-ink-${index})`,
                            "--beam-delay": `${j * -0.65}s`,
                        } as CSSProperties
                    }
                />
            </Fragment>
        ))}
    </g>
);

const usePrefersReducedMotion = () => {
    const [reduced, setReduced] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = () => setReduced(query.matches);
        query.addEventListener("change", handleChange);
        return () => query.removeEventListener("change", handleChange);
    }, []);

    return reduced;
};

const useDocumentHidden = () => {
    const [hidden, setHidden] = useState(() => document.hidden);

    useEffect(() => {
        const handleChange = () => setHidden(document.hidden);
        document.addEventListener("visibilitychange", handleChange);
        return () => document.removeEventListener("visibilitychange", handleChange);
    }, []);

    return hidden;
};

const ServiceTiersSection = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);

    const [view, setView] = useState({ active: 0, turn: 0 });
    const [restartKey, setRestartKey] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(() => !("IntersectionObserver" in window));
    const [keyboardFocus, setKeyboardFocus] = useState(false);
    const [announcement, setAnnouncement] = useState("");

    const reducedMotion = usePrefersReducedMotion();
    const documentHidden = useDocumentHidden();

    const { active, turn } = view;
    const isVisible = inView && !documentHidden;
    const canRotate = isVisible && !paused && !reducedMotion && !keyboardFocus;

    const select = (
        index: number,
        { announce = true, direction = 0, restart = true } = {},
    ) => {
        const next = (index + tiers.length) % tiers.length;

        if (next !== active) {
            let distance = direction || next - active;
            if (!direction && Math.abs(distance) > 2) {
                distance -= Math.sign(distance) * tiers.length;
            }
            setView({ active: next, turn: turn - distance * 90 });
        }

        if (announce) {
            setAnnouncement(`Solution ${next + 1} of 4 ${tiers[next].tab}.`);
        }

        if (restart) setRestartKey((key) => key + 1);
    };

    useEffect(() => {
        if (!canRotate) return;

        const timer = window.setTimeout(() => {
            setView((current) => ({
                active: (current.active + 1) % tiers.length,
                turn: current.turn - 90,
            }));
        }, ROTATION_DELAY_MS);

        return () => window.clearTimeout(timer);
    }, [canRotate, active, restartKey]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting && entry.intersectionRatio >= 0.3);
            },
            { threshold: 0.3 },
        );

        observer.observe(stage);

        return () => observer.disconnect();
    }, []);

    const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;

        let index: number;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") index = (active + 1) % 4;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") index = (active + 3) % 4;
        else if (event.key === "Home") index = 0;
        else if (event.key === "End") index = 3;
        else return;

        event.preventDefault();
        select(index);
        tabRefs.current[index]?.focus();
    };

    const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") return;
        if ((event.target as Element).closest("button,a")) return;
        dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };

    // Horizontal swipes change a solution; vertical gestures keep native page scrolling.
    const handleStagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.id) return;

        dragRef.current = null;
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;

        if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.4) {
            const direction = dx < 0 ? 1 : -1;
            select(active + direction, { direction });
        }
    };

    const handleRelationshipClick = (index: number) => {
        trackCtaClick(`solutions_${pad(index + 1)}_discovery`);
    };

    const sectionClassName = [
        "service-tiers",
        "is-ready",
        isVisible && "is-visible",
        (paused || reducedMotion) && "is-motion-paused",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section
            id="service-tiers"
            className={sectionClassName}
            aria-labelledby="tiers-title"
            style={{ "--tier-turn": `${turn}deg` } as CSSProperties}
            onFocus={(event) => setKeyboardFocus(event.target.matches(":focus-visible"))}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setKeyboardFocus(false);
                }
            }}
            onKeyDown={(event) => {
                if (
                    ["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(
                        event.key,
                    )
                ) {
                    setKeyboardFocus(true);
                }
            }}
            onPointerDown={() => setKeyboardFocus(false)}
        >
            <header className="tiers-heading">
                <p className="tiers-eyebrow">BUILT FOR YOUR BUSINESS</p>
                <h2 id="tiers-title">
                    From A Single Product<span>To A Connected Business</span>
                </h2>
                <p className="tiers-description">
                    Choose the solution you need We can build one product,{" "}
                    <br />
                    connect your existing systems, or bring it all together
                </p>
            </header>

            <div className="tiers-explorer">
                <div
                    className="tier-tabs"
                    role="tablist"
                    aria-label="Explore our four solutions"
                    onKeyDown={handleTabKeyDown}
                >
                    {tiers.map((tier, i) => (
                        <button
                            key={tier.tab}
                            ref={(element) => {
                                tabRefs.current[i] = element;
                            }}
                            id={`tier-tab-${i + 1}`}
                            className="tier-tab"
                            type="button"
                            role="tab"
                            aria-selected={i === active}
                            aria-controls={`tier-copy-${i + 1}`}
                            tabIndex={i === active ? 0 : -1}
                            onClick={() => select(i)}
                        >
                            <span>{pad(i + 1)}</span>
                            {tier.tab}
                        </button>
                    ))}
                </div>

                <div
                    ref={stageRef}
                    className="tier-stage"
                    onPointerDown={handleStagePointerDown}
                    onPointerUp={handleStagePointerUp}
                    onPointerCancel={() => {
                        dragRef.current = null;
                    }}
                >
                    <div className="tier-copy-side">
                        <div className="tier-copy-stack">
                            {tiers.map((tier, i) => {
                                const selected = i === active;
                                return (
                                    <article
                                        key={tier.tab}
                                        id={`tier-copy-${i + 1}`}
                                        className={selected ? "tier-copy is-active" : "tier-copy"}
                                        role="tabpanel"
                                        aria-labelledby={`tier-tab-${i + 1}`}
                                        aria-hidden={!selected}
                                        inert={!selected}
                                        tabIndex={0}
                                    >
                                        <p className="tier-kicker">
                                            SOLUTION {pad(i + 1)} <span>/</span> {tier.kicker}
                                        </p>
                                        <h3 id={`tier-name-${i + 1}`}>
                                            {tier.title[0]}
                                            <br />
                                            {tier.title[1]}
                                        </h3>
                                        <p className="tier-body">{tier.body}</p>
                                        <p className="tier-example">{tier.example}</p>
                                        <a
                                            className="tier-relationship"
                                            href="#discovery-call"
                                            onClick={() => handleRelationshipClick(i)}
                                        >
                                            <span className="tier-link-symbol" aria-hidden="true">
                                                ↗
                                            </span>
                                            <span>{tier.relationship}</span>
                                        </a>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="tier-controls">
                            <button
                                className="tier-arrow tier-previous"
                                type="button"
                                aria-label="Previous solution"
                                onClick={() => select(active - 1, { direction: -1 })}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 12H5m6-6-6 6 6 6" />
                                </svg>
                            </button>
                            <span className="tier-counter" aria-hidden="true">
                                <b>{pad(active + 1)}</b>
                                <span>/ 04</span>
                            </span>
                            <button
                                className="tier-arrow tier-next"
                                type="button"
                                aria-label="Next solution"
                                onClick={() => select(active + 1, { direction: 1 })}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M5 12h14m-6-6 6 6-6 6" />
                                </svg>
                            </button>
                            <button
                                className="tier-motion"
                                type="button"
                                aria-label={
                                    paused
                                        ? "Play solutions and animations"
                                        : "Pause solutions and animations"
                                }
                                aria-pressed={paused}
                                onClick={() => {
                                    if (paused) setKeyboardFocus(false);
                                    setPaused(!paused);
                                }}
                            >
                                <svg className="tier-pause-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <rect x="5" y="4" width="3" height="12" rx=".7" />
                                    <rect x="12" y="4" width="3" height="12" rx=".7" />
                                </svg>
                                <svg className="tier-play-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M6 3.5 16 10 6 165z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="tier-art" aria-label="Illustrations of our solutions">
                        <div className="tier-wheel-rings" aria-hidden="true" />
                        <svg className="tier-icon-library" width="0" height="0" aria-hidden="true">
                            <defs>
                                <symbol id="tier-icon-ai" viewBox="0 0 24 24"><path d="m12 3 2.5 65L21 12l-6.5 25L12 21l-2.5-65L3 12l65-25Z" /></symbol>
                                <symbol id="tier-icon-chat" viewBox="0 0 24 24"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z" /><path d="M7 9h10M7 13h6" /></symbol>
                                <symbol id="tier-icon-code" viewBox="0 0 24 24"><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18" /></symbol>
                                <symbol id="tier-icon-link" viewBox="0 0 24 24"><path d="m9 15 6-6M7 14l-2 2a4 4 0 0 0 5 5l4-4a4 4 0 0 0 0-6M17 10l2-2a4 4 0 0 0-5-5l-4 4a4 4 0 0 0 0 6" /></symbol>
                                <symbol id="tier-icon-chart" viewBox="0 0 24 24"><path d="M4 3v17h17M8 15V9m5 6V5m5 10v-4" /></symbol>
                                <symbol id="tier-icon-finance" viewBox="0 0 24 24"><path d="M3 7h18v13H3ZM3 7l15-4v4M16 11h5v5h-5Z" /></symbol>
                                <symbol id="tier-icon-ops" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></symbol>
                                <symbol id="tier-icon-people" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3" /><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v4" /></symbol>
                                <symbol id="tier-icon-platform" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2" /><path d="M2 8h20M8 8v13m4-9h6m-6 4h4" /></symbol>
                                <symbol id="tier-icon-document" viewBox="0 0 24 24"><path d="M5 3h9l5 5v13H5ZM14 3v6h5M8 13h8m-8 4h6" /></symbol>
                                <symbol id="tier-icon-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></symbol>
                                <symbol id="tier-icon-data" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0" /></symbol>
                            </defs>
                        </svg>

                        <div className="tier-wheel">
                            <div className="tier-station" style={{ "--station-angle": "0deg" } as CSSProperties}>
                                <figure
                                    className={active === 0 ? "tier-diagram tier-demo is-active" : "tier-diagram tier-demo"}
                                    id="tier-figure-1"
                                    aria-hidden={active !== 0}
                                >
                                    <svg viewBox="0 0 500 500" role="img" aria-labelledby="tier-svg-title-1 tier-svg-desc-1">
                                        <BeamGradient index={0} />
                                        <title id="tier-svg-title-1">Ask your preferred AI agent about increasing factory output through MCP</title>
                                        <desc id="tier-svg-desc-1">Illustrative production conversation: How can we boost factory output? The request travels through MCP to the AI harness, which connects business data Data returns through MCP The assistant answers: Line 2 runs at 92 percent efficiency Use its setup across all lines ChatGPT and Claude are two examples of compatible AI agents</desc>
                                        <text x="250" y="54" className="tier-demo-label">EXAMPLE CONVERSATION</text>
                                        <rect x="77" y="75" width="346" height="200" rx="10" className="tier-demo-panel" />
                                        <image href={chatgptLogo} x="97" y="81" width="38" height="38" />
                                        <text x="140" y="105" className="tier-demo-left tier-provider">ChatGPT</text>
                                        <path d="M250 87V112" className="tier-demo-rule" aria-hidden="true" />
                                        <image href={claudeLogo} x="284" y="88" width="24" height="24" />
                                        <text x="320" y="105" className="tier-demo-left tier-provider">Claude</text>
                                        <g className="tier-question">
                                            <rect x="97" y="129" width="306" height="43" rx="6" className="tier-question-bubble" />
                                            <text x="112" y="155" className="tier-demo-left tier-chat-text">How can we boost factory output?</text>
                                        </g>
                                        <g className="tier-typing" aria-hidden="true">
                                            <circle cx="121" cy="208" r="3" />
                                            <circle cx="133" cy="208" r="3" />
                                            <circle cx="145" cy="208" r="3" />
                                            <text x="164" y="213" className="tier-demo-left tier-demo-small">Checking business data…</text>
                                        </g>
                                        <g className="tier-answer">
                                            <rect x="97" y="186" width="306" height="70" rx="6" className="tier-answer-bubble" />
                                            <text x="112" y="212" className="tier-demo-left tier-chat-text">Line 2 runs at 92% efficiency</text>
                                            <text x="112" y="239" className="tier-demo-left tier-chat-detail">Use its setup across all lines</text>
                                        </g>
                                        <BeamPaths
                                            index={0}
                                            className="tier-paths tier-mcp-flow"
                                            paths={[
                                                { d: "M250 275V394", className: "tier-request-path" },
                                                { d: "M250 394V275", className: "tier-return-path" },
                                            ]}
                                        />
                                        <path d="m245 295 5 7 5-7" className="tier-flow-arrow" aria-hidden="true" />
                                        <path d="m245 383 5-7 5 7" className="tier-flow-arrow" aria-hidden="true" />
                                        <text x="194" y="298.5" dominantBaseline="middle" className="tier-demo-small">Request</text>
                                        <text x="207" y="379.5" dominantBaseline="middle" className="tier-demo-small">Data</text>
                                        <g className="tier-node tier-hub">
                                            <rect x="177" y="322" width="146" height="43" rx="6" />
                                            <use href="#tier-icon-link" x="194" y="333" width="21" height="21" />
                                            <text x="267" y="350">MCP</text>
                                        </g>
                                        <g className="tier-node tier-foundation tier-data-source">
                                            <rect x="147" y="394" width="206" height="52" rx="6" />
                                            <text x="250" y="415" className="tier-demo-small">YOUR BUSINESS DATA</text>
                                            <text x="250" y="437">AI harness</text>
                                        </g>
                                    </svg>
                                </figure>
                            </div>

                            <div className="tier-station" style={{ "--station-angle": "90deg" } as CSSProperties}>
                                <figure
                                    className={active === 1 ? "tier-diagram tier-demo is-active" : "tier-diagram tier-demo"}
                                    id="tier-figure-2"
                                    aria-hidden={active !== 1}
                                >
                                    <svg viewBox="0 0 500 500" role="img" aria-labelledby="tier-svg-title-2 tier-svg-desc-2">
                                        <BeamGradient index={1} />
                                        <title id="tier-svg-title-2">Documents, operational data and client emails connected to your AI harness</title>
                                        <desc id="tier-svg-desc-2">Information from departments and client emails, including inquiries and requests, flows into the AI harness for processing, context and analysis The insights appear in the CRM workspace, a shared view for your team</desc>
                                        <BeamPaths
                                            index={1}
                                            paths={[
                                                { d: "M112 124C112 185 250 156 250 207" },
                                                { d: "M250 143V207" },
                                                { d: "M388 124C388 185 250 156 250 207" },
                                                { d: "M250 277V327" },
                                            ]}
                                        />
                                        <g className="tier-node">
                                            <circle cx="112" cy="98" r="27" />
                                            <use href="#tier-icon-document" x="99" y="85" width="26" height="26" />
                                            <text x="112" y="148">Documents</text>
                                        </g>
                                        <g className="tier-node">
                                            <circle cx="250" cy="83" r="27" />
                                            <use href="#tier-icon-data" x="237" y="70" width="26" height="26" />
                                            <text x="250" y="126">Operational data</text>
                                        </g>
                                        <g className="tier-node">
                                            <circle cx="388" cy="98" r="27" />
                                            <use href="#tier-icon-mail" x="375" y="85" width="26" height="26" />
                                            <text x="388" y="148">Client emails</text>
                                        </g>
                                        <g className="tier-node tier-hub">
                                            <rect x="136" y="207" width="228" height="70" rx="6" />
                                            <use href="#tier-icon-ai" x="172" y="220" width="25" height="25" />
                                            <text x="272" y="236">AI harness</text>
                                            <text x="250" y="258" className="tier-demo-small">Connect · Analyze · Assist</text>
                                        </g>
                                        <text x="326" y="309" className="tier-demo-small">Insights ↓</text>
                                        <g className="tier-workspace">
                                            <rect x="92" y="327" width="316" height="88" rx="8" className="tier-demo-panel" />
                                            <use href="#tier-icon-platform" x="112" y="344" width="23" height="23" />
                                            <text x="147" y="361" className="tier-demo-left tier-provider">Your CRM workspace</text>
                                            <path d="M111 377H389" className="tier-demo-rule" />
                                            <text x="250" y="401" className="tier-demo-small">One shared view for your team</text>
                                        </g>
                                        <text x="250" y="450" className="tier-demo-label">THE WORKSPACE YOU USE</text>
                                    </svg>
                                </figure>
                            </div>

                            <div className="tier-station" style={{ "--station-angle": "180deg" } as CSSProperties}>
                                <figure
                                    className={active === 2 ? "tier-diagram tier-demo is-active" : "tier-diagram tier-demo"}
                                    id="tier-figure-3"
                                    aria-hidden={active !== 2}
                                >
                                    <svg viewBox="0 0 500 500" role="img" aria-labelledby="tier-svg-title-3 tier-svg-desc-3">
                                        <BeamGradient index={2} />
                                        <title id="tier-svg-title-3">A real-time CRM with data-informed suggestions</title>
                                        <desc id="tier-svg-desc-3">Illustrative CRM: customer activity and team updates flow into a live workspace A new inquiry is assigned to sales Analysis suggests following up with AB Ltd because there has been no reply for five days Suggestions are for the team to review</desc>
                                        <BeamPaths
                                            index={2}
                                            paths={[
                                                { d: "M141 109C141 151 208 132 208 181" },
                                                { d: "M359 109C359 151 292 132 292 181" },
                                            ]}
                                        />
                                        <g className="tier-node">
                                            <circle cx="141" cy="85" r="25" />
                                            <use href="#tier-icon-people" x="129" y="73" width="24" height="24" />
                                            <text x="141" y="135">Customers</text>
                                        </g>
                                        <g className="tier-node">
                                            <circle cx="359" cy="85" r="25" />
                                            <use href="#tier-icon-ops" x="347" y="73" width="24" height="24" />
                                            <text x="359" y="135">Your teams</text>
                                        </g>
                                        <rect x="66" y="179" width="368" height="225" rx="9" className="tier-demo-panel" />
                                        <use href="#tier-icon-platform" x="87" y="197" width="25" height="25" />
                                        <text x="125" y="217" className="tier-demo-left tier-provider">Your CRM</text>
                                        <circle cx="350" cy="211" r="4" className="tier-live-dot" />
                                        <text x="379" y="216" className="tier-demo-small tier-live-label">LIVE</text>
                                        <path d="M85 237H415" className="tier-demo-rule" />
                                        <g className="tier-crm-event">
                                            <rect x="86" y="253" width="328" height="38" rx="5" className="tier-event-bubble" />
                                            <circle cx="103" cy="272" r="3" className="tier-event-dot" />
                                            <text x="116" y="278" className="tier-demo-left tier-chat-detail tier-event-first">New inquiry received</text>
                                            <text x="116" y="278" className="tier-demo-left tier-chat-detail tier-event-second">Lead assigned to sales</text>
                                        </g>
                                        <g className="tier-suggestion">
                                            <rect x="86" y="306" width="328" height="80" rx="6" className="tier-answer-bubble" />
                                            <use href="#tier-icon-ai" x="100" y="317" width="19" height="19" />
                                            <text x="128" y="332" className="tier-demo-left tier-demo-small">SUGGESTED NEXT ACTION</text>
                                            <text x="101" y="356" className="tier-demo-left tier-chat-text">Follow up with AB Ltd</text>
                                            <text x="101" y="377" className="tier-demo-left tier-chat-detail">No reply in 5 days</text>
                                        </g>
                                        <text x="250" y="446" className="tier-demo-label">ILLUSTRATIVE CRM ACTIVITY</text>
                                    </svg>
                                </figure>
                            </div>

                            <div className="tier-station" style={{ "--station-angle": "270deg" } as CSSProperties}>
                                <figure
                                    className={active === 3 ? "tier-diagram is-active" : "tier-diagram"}
                                    id="tier-figure-4"
                                    aria-hidden={active !== 3}
                                >
                                    <svg viewBox="0 0 500 500" role="img" aria-labelledby="tier-svg-title-4 tier-svg-desc-4">
                                        <title id="tier-svg-title-4">A standalone website and mobile app</title>
                                        <desc id="tier-svg-desc-4">A website and an app shown as complete, independent products</desc>
                                        <g className="tier-device">
                                            <rect x="66" y="110" width="321" height="235" rx="6" />
                                            <path d="M66 141H387" />
                                            <circle cx="82" cy="126" r="3" />
                                            <circle cx="94" cy="126" r="3" />
                                            <circle cx="106" cy="126" r="3" />
                                            <rect x="91" y="168" width="93" height="8" rx="3" className="tier-skeleton" />
                                            <rect x="91" y="190" width="143" height="7" rx="3" className="tier-skeleton muted" />
                                            <rect x="91" y="207" width="112" height="7" rx="3" className="tier-skeleton muted" />
                                            <rect x="91" y="239" width="65" height="24" rx="4" className="tier-device-button" />
                                            <rect x="262" y="170" width="97" height="93" rx="6" className="tier-device-art" />
                                            <use href="#tier-icon-ai" x="288" y="194" width="45" height="45" />
                                            <text x="222" y="314">Your website</text>
                                        </g>
                                        <g className="tier-device tier-phone">
                                            <rect x="305" y="234" width="110" height="183" rx="14" />
                                            <rect x="340" y="245" width="39" height="4" rx="2" />
                                            <rect x="320" y="270" width="80" height="66" rx="6" className="tier-device-art" />
                                            <use href="#tier-icon-ai" x="345" y="288" width="30" height="30" />
                                            <rect x="320" y="350" width="58" height="5" rx="2" className="tier-skeleton" />
                                            <rect x="320" y="364" width="79" height="4" rx="2" className="tier-skeleton muted" />
                                            <text x="360" y="398">Your app</text>
                                        </g>
                                    </svg>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tier-stack-key" aria-label="How the solutions connect">
                    <span className="tier-stack-label">SOLUTIONS THAT CONNECT</span>
                    <span className={active === 2 ? "is-active" : undefined}>03 CRM</span>
                    <i aria-hidden="true">→</i>
                    <span className={active === 1 ? "is-active" : undefined}>02 AI Harness</span>
                    <i aria-hidden="true">→</i>
                    <span className={active === 0 ? "is-active" : undefined}>01 MCP Access</span>
                    <span className={active === 3 ? "tier-independent is-active" : "tier-independent"}>
                        04 Standalone Products
                    </span>
                </div>

                <p className="tier-announcement" role="status" aria-live="polite" aria-atomic="true">
                    {announcement}
                </p>
            </div>
        </section>
    );
};

export default ServiceTiersSection;
