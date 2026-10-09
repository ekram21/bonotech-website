import { useEffect, useRef } from "react";

import projectsBackground from "@/assets/about/projects-background.mp4";
import commitmentPortrait from "@/assets/testimonials/evan-milho.png";
import evoLogo from "@/assets/clients/evo.svg";
import dataMotion from "@/assets/about/data-motion.mp4";
import { scrollToSection } from "@/lib/scroll";

import "./AboutImpactSection.css";

const scrollToDiscoveryCall = () => {
    scrollToSection("discovery-call");
};

const AboutImpactSection = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grid = gridRef.current;
        const summary = grid?.querySelector(".project-summary");
        const testimonial = grid?.querySelector(".client-testimonial");

        let copyObserver: ResizeObserver | undefined;

        if (summary && testimonial && "ResizeObserver" in window) {
            const count = summary.querySelector("h3");
            const quote = testimonial.querySelector("blockquote");
            const attribution = testimonial.querySelector("figcaption");

            if (count && quote && attribution) {
                const padding = (element: Element) => {
                    const style = getComputedStyle(element);

                    return (
                        parseFloat(style.paddingTop) +
                        parseFloat(style.paddingBottom)
                    );
                };

                let previousHeight = 0;

                const alignCopy = () => {
                    if (!grid) return;
                    const projectHeight =
                        count.getBoundingClientRect().height +
                        padding(summary);
                    const quoteStyle = getComputedStyle(quote);
                    const quoteHeight =
                        quote.getBoundingClientRect().height +
                        parseFloat(quoteStyle.marginBottom) +
                        attribution.getBoundingClientRect().height +
                        padding(testimonial);
                    const height = Math.ceil(
                        Math.max(projectHeight, quoteHeight),
                    );

                    if (height !== previousHeight) {
                        grid.style.setProperty(
                            "--bento-copy-height",
                            `${height}px`,
                        );
                        previousHeight = height;
                    }
                };

                copyObserver = new ResizeObserver(alignCopy);
                [count, quote, attribution].forEach((element) =>
                    copyObserver?.observe(element),
                );
                alignCopy();
            }
        }

        const preference = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        const cleanups: Array<() => void> = [];

        document.querySelectorAll(".about .bento-video").forEach((element) => {
            const video = element as HTMLVideoElement;
            const card = video.closest(".about-card");

            if (!card) return;

            const button = card.querySelector(
                ".bento-media-toggle",
            ) as HTMLButtonElement | null;

            if (!button) return;

            let visible = false;
            let pausedByUser = preference.matches;

            video.muted = true;
            button.hidden = false;

            const showState = () => {
                button.setAttribute("aria-pressed", String(video.paused));
                button.setAttribute(
                    "aria-label",
                    `${video.paused ? "Play" : "Pause"} ${button.dataset.mediaLabel} video`,
                );
            };

            const sync = () => {
                if (!visible || document.hidden || pausedByUser) {
                    video.pause();
                    showState();
                    return;
                }

                video.play().then(showState).catch(showState);
            };

            const handleClick = () => {
                pausedByUser = !video.paused;
                sync();
            };

            const handlePlay = () => showState();
            const handlePause = () => showState();
            const handleLoadedData = () => sync();
            const handleError = () => {
                button.hidden = true;
            };

            const handlePreferenceChange = (event: MediaQueryListEvent) => {
                pausedByUser = event.matches;
                sync();
            };

            const handleVisibilityChange = () => sync();
            const handlePageHide = () => video.pause();
            const handlePageShow = () => sync();

            button.addEventListener("click", handleClick);
            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);
            video.addEventListener("loadeddata", handleLoadedData);
            video.addEventListener("error", handleError);
            preference.addEventListener("change", handlePreferenceChange);
            document.addEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.addEventListener("pagehide", handlePageHide);
            window.addEventListener("pageshow", handlePageShow);

            let intersectionObserver: IntersectionObserver | undefined;

            if ("IntersectionObserver" in window) {
                intersectionObserver = new IntersectionObserver(
                    ([entry]) => {
                        visible = entry.isIntersecting;
                        sync();
                    },
                    { threshold: 0.05 },
                );
                intersectionObserver.observe(card);
            } else {
                visible = true;
                sync();
            }

            showState();

            cleanups.push(() => {
                button.removeEventListener("click", handleClick);
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("pause", handlePause);
                video.removeEventListener("loadeddata", handleLoadedData);
                video.removeEventListener("error", handleError);
                preference.removeEventListener(
                    "change",
                    handlePreferenceChange,
                );
                document.removeEventListener(
                    "visibilitychange",
                    handleVisibilityChange,
                );
                window.removeEventListener("pagehide", handlePageHide);
                window.removeEventListener("pageshow", handlePageShow);
                intersectionObserver?.disconnect();
                video.pause();
            });
        });

        return () => {
            copyObserver?.disconnect();
            cleanups.forEach((cleanup) => cleanup());
        };
    }, []);

    return (
        <section
            id="about-bonotech"
            className="about"
            aria-labelledby="about-title"
        >
            <header className="about-heading">
                <p className="about-eyebrow">ABOUT BONOTECH</p>
                <h2 id="about-title">
                    Built for Business
                    <br />
                    <span className="about-title-accent">
                        Proven in Practice
                    </span>
                </h2>
                <p className="about-description">
                    A global consulting partner dedicated to building
                    <br />
                    smarter and more adaptive tech.
                </p>
            </header>

            <div ref={gridRef} className="about-grid">
                <article
                    className="about-card about-projects"
                    aria-labelledby="projects-title"
                >
                    <div
                        className="bento-media project-media"
                        aria-hidden="true"
                    >
                        <video
                            className="bento-video project-video"
                            src={projectsBackground}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            tabIndex={-1}
                        />
                    </div>
                    <button
                        className="motion-toggle bento-media-toggle"
                        type="button"
                        aria-label="Pause project video"
                        aria-pressed={false}
                        data-media-label="project"
                        hidden
                    >
                        <svg
                            className="pause-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <rect x="5" y="4" width="3" height="12" rx=".7" />
                            <rect x="12" y="4" width="3" height="12" rx=".7" />
                        </svg>
                        <svg
                            className="play-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M6 3.5 16 10 6 16.5z" />
                        </svg>
                    </button>
                    <div className="project-summary">
                        <h3 id="projects-title">
                            <span className="about-number">
                                23<span>+</span>
                            </span>
                            <span className="project-caption">
                                projects—and that's just the last{" "}
                                <strong>6 months.</strong>
                            </span>
                        </h3>
                    </div>
                </article>

                <article
                    className="about-card about-commitment"
                    aria-labelledby="commitment-title"
                >
                    <img
                        className="testimonial-photo"
                        src={commitmentPortrait}
                        alt="Evan Milho"
                        width={409}
                        height={525}
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="testimonial-shade" aria-hidden="true" />
                    <div className="commitment-topline">
                        <h3 id="commitment-title" className="about-card-label">
                            Measurable Commitment
                        </h3>
                        <span className="pixel-corner" aria-hidden="true" />
                    </div>
                    <p className="about-number commitment-number">
                        100<span>%</span>
                    </p>
                    <figure className="client-testimonial">
                        <blockquote>
                            <p>
                                “I couldn’t believe my eyes when I first saw what
                                the team had built out for me. Looks so good.
                                There are massive companies in the space who
                                still haven’t modernised a proper web-based
                                application form, so excited to be the first to
                                launch one for card prep &amp; cleaning.”
                            </p>
                        </blockquote>
                        <figcaption>
                            <div className="testimonial-identity">
                                <span className="testimonial-name">
                                    Evan Milho
                                </span>
                                <span className="testimonial-role">
                                    CEO, EVO Grading
                                </span>
                            </div>
                            <img
                                className="testimonial-company testimonial-company-evo"
                                src={evoLogo}
                                alt="EVO Grading"
                                width={118}
                                height={138}
                                loading="lazy"
                                decoding="async"
                            />
                        </figcaption>
                    </figure>
                </article>

                <article
                    className="about-card about-data"
                    aria-labelledby="data-title"
                >
                    <div className="bento-media data-media" aria-hidden="true">
                        <video
                            className="bento-video data-video"
                            src={dataMotion}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            tabIndex={-1}
                        />
                        <div className="data-video-tint" />
                    </div>
                    <button
                        className="motion-toggle bento-media-toggle"
                        type="button"
                        aria-label="Pause data video"
                        aria-pressed={false}
                        data-media-label="data"
                        hidden
                    >
                        <svg
                            className="pause-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <rect x="5" y="4" width="3" height="12" rx=".7" />
                            <rect x="12" y="4" width="3" height="12" rx=".7" />
                        </svg>
                        <svg
                            className="play-icon"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M6 3.5 16 10 6 16.5z" />
                        </svg>
                    </button>
                    <h3 id="data-title" className="about-card-label">
                        Data Points
                    </h3>
                    <p className="about-number data-number">
                        520k<span>+</span>
                    </p>
                    <p className="about-data-description">
                        Analyzed monthly to power smarter tech for businesses.
                    </p>
                </article>

                <button
                    className="about-card about-contact"
                    type="button"
                    onClick={scrollToDiscoveryCall}
                >
                    <span>Get In Touch</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M5 19 19 5M5 5h14v14"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default AboutImpactSection;
