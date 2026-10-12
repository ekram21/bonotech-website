import { useEffect, useRef } from "react";

import "./SprintMetricsSection.css";

const SprintMetricsSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section || !("IntersectionObserver" in window)) {
            return;
        }

        const preference = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        const items = [
            ...section.querySelectorAll<HTMLElement>("[data-reveal]"),
        ];

        if (preference.matches) {
            return;
        }

        const reveal = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;

                    entry.target.classList.add("is-revealed");
                    reveal.unobserve(entry.target);
                }
            },
            { threshold: 0.12 },
        );

        section.classList.add("is-enhanced");
        items.forEach((item) => reveal.observe(item));

        const handlePreferenceChange = (event: MediaQueryListEvent) => {
            if (!event.matches) return;

            reveal.disconnect();
            section.classList.remove("is-enhanced");
        };

        preference.addEventListener("change", handlePreferenceChange);

        return () => {
            reveal.disconnect();
            section.classList.remove("is-enhanced");
            preference.removeEventListener("change", handlePreferenceChange);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="sprint-numbers"
            className="metrics"
            aria-labelledby="metrics-title"
        >
            <div className="metrics-grid">
                <header className="metrics-heading" data-reveal>
                    <div className="metrics-marker" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <h2 id="metrics-title">
                        <span>Numbers That</span>{" "}
                        <span>Define Our</span>{" "}
                        <span className="title-accent">Sprints</span>
                    </h2>
                </header>

                <article
                    className="metric-card metric-development"
                    aria-labelledby="development-title"
                    data-reveal
                >
                    <div className="card-topline" aria-hidden="true">
                        <span>01</span>
                        <span className="pixel-corner" />
                    </div>
                    <div className="metric-content">
                        <p className="metric-value">
                            400<span>%</span>
                        </p>
                        <h3 id="development-title">Faster Development</h3>
                        <p className="metric-description">
                            Focused sprints, one team across the whole surface,
                            and no hand-off lag between disciplines.
                        </p>
                    </div>
                    <svg
                        className="metric-graphic development-graphic"
                        viewBox="0 0 320 185"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <defs>
                            <linearGradient
                                id="growth-ink"
                                x1="0"
                                y1="1"
                                x2="1"
                                y2="0"
                            >
                                <stop offset="0" stopColor="#2f1952" />
                                <stop offset="1" stopColor="#8954e8" />
                            </linearGradient>
                        </defs>
                        <path
                            className="growth-guide"
                            d="M4 165H316"
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity=".12"
                        />
                        <g className="growth-pixels" fill="url(#growth-ink)">
                            <path d="M10 143h10v10H10z M22 143h10v10H22z M22 131h10v10H22z M34 131h10v10H34z M46 131h10v10H46z M46 119h10v10H46z M58 119h10v10H58z M70 119h10v10H70z M70 107h10v10H70z M82 107h10v10H82z M94 107h10v10H94z M94 95h10v10H94z M106 95h10v10H106z M118 95h10v10H118z M118 83h10v10H118z M130 83h10v10H130z M142 83h10v10H142z M142 71h10v10H142z M154 71h10v10H154z M166 71h10v10H166z M166 59h10v10H166z M178 59h10v10H178z M190 59h10v10H190z M190 47h10v10H190z M202 47h10v10H202z M214 47h10v10H214z M214 35h10v10H214z M226 35h10v10H226z M238 35h10v10H238z M238 23h10v10H238z M250 23h10v10H250z M262 23h10v10H262z M262 11h10v10H262z M274 11h10v10H274z M286 11h10v10H286z" />
                        </g>
                        <g className="growth-echo" fill="#674ea5" opacity=".20">
                            <path d="M10 131h10v10H10z M46 143h10v10H46z M82 131h10v10H82z M106 71h10v10H106z M142 107h10v10H142z M178 83h10v10H178z M214 11h10v10H214z M250 47h10v10H250z M286 35h10v10H286z" />
                        </g>
                    </svg>
                </article>

                <article
                    className="metric-card metric-automation"
                    aria-labelledby="automation-title"
                    data-reveal
                >
                    <div className="card-topline" aria-hidden="true">
                        <span>02</span>
                        <span className="pixel-corner" />
                    </div>
                    <svg
                        className="metric-graphic automation-graphic"
                        viewBox="0 0 320 278"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <g fill="none" stroke="#674ea5">
                            <circle
                                cx="160"
                                cy="137"
                                r="111"
                                strokeOpacity=".18"
                            />
                            <circle
                                cx="160"
                                cy="137"
                                r="82"
                                strokeOpacity=".27"
                            />
                            <circle
                                cx="160"
                                cy="137"
                                r="52"
                                strokeOpacity=".4"
                            />
                        </g>
                        <g className="orbit-system">
                            <rect
                                x="43"
                                y="116"
                                width="25"
                                height="25"
                                rx="2"
                                fill="#2f1952"
                            />
                            <path
                                d="M51 124h3v3h-3z M57 124h3v3h-3z M51 130h3v3h-3z M57 130h3v3h-3z"
                                fill="#fff"
                            />
                            <rect
                                x="206"
                                y="45"
                                width="29"
                                height="29"
                                rx="2"
                                fill="#652cd8"
                            />
                            <path
                                d="m216 59 3 3 6-7"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <rect
                                x="188"
                                y="215"
                                width="17"
                                height="17"
                                rx="1"
                                fill="#674ea5"
                            />
                            <rect
                                x="247"
                                y="163"
                                width="10"
                                height="10"
                                fill="#b6a1d9"
                            />
                            <rect
                                x="105"
                                y="60"
                                width="9"
                                height="9"
                                fill="#b6a1d9"
                            />
                        </g>
                        <rect
                            x="137"
                            y="114"
                            width="46"
                            height="46"
                            rx="8"
                            fill="#652cd8"
                        />
                        <path
                            d="M146 128h5v5h-5z M157.5 128h5v5h-5z M169 128h5v5h-5z M146 139h5v5h-5z M157.5 139h5v5h-5z M169 139h5v5h-5z"
                            fill="#fff"
                        />
                    </svg>
                    <div className="metric-content">
                        <p className="metric-value">
                            40<span>%</span>
                        </p>
                        <h3 id="automation-title">Less Repetitive Work</h3>
                        <p className="metric-description">
                            AI-assisted capture, validation and intelligent RPA
                            take the <span className="whitespace-nowrap">re-keying</span> out of the day.
                        </p>
                    </div>
                </article>

                <article
                    className="metric-card metric-quality"
                    aria-labelledby="quality-title"
                    data-reveal
                >
                    <div className="card-topline" aria-hidden="true">
                        <span>03</span>
                        <span className="pixel-corner" />
                    </div>
                    <div className="metric-content">
                        <p className="metric-value">
                            200<span>%</span>
                        </p>
                        <h3 id="quality-title">Faster QA Cycles</h3>
                        <p className="metric-description">
                            Automated regression and continuous checks, so
                            hardening does not become its own project.
                        </p>
                    </div>
                    <svg
                        className="metric-graphic quality-graphic"
                        viewBox="0 0 320 192"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <g className="qa-row qa-row-one">
                            <rect
                                x="5"
                                y="15"
                                width="44"
                                height="44"
                                rx="3"
                                fill="#fff"
                                fillOpacity=".12"
                            />
                            <path
                                d="m17 36 7 7 13-15"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <path
                                d="M72 28h119 M72 44h73"
                                stroke="#fff"
                                strokeOpacity=".22"
                                strokeWidth="5"
                            />
                            <rect
                                x="274"
                                y="30"
                                width="14"
                                height="14"
                                fill="#fff"
                            />
                        </g>
                        <g className="qa-row qa-row-two">
                            <rect
                                x="5"
                                y="75"
                                width="44"
                                height="44"
                                rx="3"
                                fill="#fff"
                                fillOpacity=".12"
                            />
                            <path
                                d="m17 96 7 7 13-15"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <path
                                d="M72 88h158 M72 104h99"
                                stroke="#fff"
                                strokeOpacity=".22"
                                strokeWidth="5"
                            />
                            <rect
                                x="274"
                                y="90"
                                width="14"
                                height="14"
                                fill="#fff"
                                fillOpacity=".65"
                            />
                        </g>
                        <g className="qa-row qa-row-three">
                            <rect
                                x="5"
                                y="135"
                                width="44"
                                height="44"
                                rx="3"
                                fill="#fff"
                                fillOpacity=".12"
                            />
                            <path
                                d="m17 156 7 7 13-15"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2"
                            />
                            <path
                                d="M72 148h101 M72 164h134"
                                stroke="#fff"
                                strokeOpacity=".22"
                                strokeWidth="5"
                            />
                            <rect
                                x="274"
                                y="150"
                                width="14"
                                height="14"
                                fill="#fff"
                                fillOpacity=".35"
                            />
                        </g>
                    </svg>
                </article>
            </div>
            <p className="metrics-disclaimer">
                These figures may vary from project to project.
            </p>
        </section>
    );
};

export default SprintMetricsSection;
