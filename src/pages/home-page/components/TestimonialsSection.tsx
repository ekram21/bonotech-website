import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import evoLogo from "@/assets/clients/evo.svg";
import polysignalsLogo from "@/assets/clients/polysignals.svg";
import zatiqLogo from "@/assets/clients/zatiq.svg";
import gustavLogo from "@/assets/clients/gustav.svg";
import ditechLogo from "@/assets/clients/ditech.svg";

import evanMilho from "@/assets/testimonials/evan-milho.png";
import nafisAbrar from "@/assets/testimonials/nafis-abrar.png";
import sultanMoni from "@/assets/testimonials/sultan-moni-new.png";
import shohiduzzamanShakil from "@/assets/testimonials/shohiduzzaman-shakil.png";
import rakibulHasanRaihan from "@/assets/testimonials/rakibul-hasan-raihan.png";

import "./TestimonialsSection.css";
import { initTestimonialWaves } from "./testimonialWaves";

type Testimonial = {
    id: string;
    slideClass: string;
    name: string;
    role: string;
    handle: string;
    quote: string;
    logo: string;
    logoClassName?: string;
    portrait: string;
    portraitAlt: string;
};

const testimonials: Testimonial[] = [
    {
        id: "testimonial-evan",
        slideClass: "testimonial-evan",
        name: "Evan Milho",
        role: "CEO, EVO Grading",
        handle: "@evocardprep",
        quote:
            "I couldn\u2019t believe my eyes when I first saw what the team had built out for me. Looks so good. There are massive companies in the space who still haven\u2019t modernised a proper web-based application form, so excited to be the first to launch one for card prep & cleaning.",
        logo: evoLogo,
        logoClassName: "testimonial-logo testimonial-logo-evo",
        portrait: evanMilho,
        portraitAlt: "Evan Milho",
    },
    {
        id: "testimonial-nafis",
        slideClass: "testimonial-nafis",
        name: "Nafis Abrar",
        role: "ML Engineer at Meta",
        handle: "@polysignals.app",
        quote:
            "Polysignals is the highest quality app built in the shortest possible time that I have seen in quite some time. Speaking as someone who works with the highest level of engineers on a daily basis, Bonotech is the real deal!",
        logo: polysignalsLogo,
        logoClassName: "testimonial-logo",
        portrait: nafisAbrar,
        portraitAlt: "Nafis Abrar",
    },
    {
        id: "testimonial-sultan",
        slideClass: "testimonial-sultan",
        name: "Sultan Moni",
        role: "Founder and CEO, Zatiq",
        handle: "@zatiqglobal",
        quote:
            "Bonotech brought a thoughtful product perspective to the table. Their consultancy helped us look at the experience more strategically, and I especially loved the UI/UX suggestions \u2014 they give users a quick, engaging win while making the product easier to understand from the start.",
        logo: zatiqLogo,
        logoClassName: "testimonial-logo testimonial-logo-zatiq",
        portrait: sultanMoni,
        portraitAlt: "Sultan Moni",
    },
    {
        id: "testimonial-shakil",
        slideClass: "testimonial-shakil",
        name: "MD. Shohiduzzaman Shakil",
        role: "Generalist \u2014 Human Resources, Mermaid Beach Resort",
        handle: "@gustavclub",
        quote:
            "Gustav is a user-friendly, visually appealing all-in-one cloud PMS. Intuitive, time-saving, and reliable \u2014 with excellent reports and friendly support for effortless hotel management.",
        logo: gustavLogo,
        logoClassName: "testimonial-logo",
        portrait: shohiduzzamanShakil,
        portraitAlt: "MD. Shohiduzzaman Shakil",
    },
    {
        id: "testimonial-raihan",
        slideClass: "testimonial-raihan",
        name: "MD. Rakibul Hasan Raihan",
        role: "Project Coordinator, DITECH",
        handle: "@ditechbd",
        quote:
            "The CRM has significantly improved how we monitor and manage our sales team by consolidating key information into one centralized dashboard. What impressed me most was how quickly everything came together; the speed of delivery was genuinely new and remarkable to me.",
        logo: ditechLogo,
        logoClassName: "testimonial-logo",
        portrait: rakibulHasanRaihan,
        portraitAlt: "MD. Rakibul Hasan Raihan",
    },
];

const TestimonialsSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const announcementRef = useRef<HTMLParagraphElement | null>(null);
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
    const timerRef = useRef<number | null>(null);
    const animationsRef = useRef<Animation[]>([]);
    const visibleRef = useRef(false);
    const hoveringRef = useRef(false);
    const pausedRef = useRef(false);
    const activeRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [sliderReady, setSliderReady] = useState(false);
    const [navVisible, setNavVisible] = useState(false);

    const getAutoDelay = useCallback((index: number) => {
        const words = testimonials[index].quote.trim().split(/\s+/).length;
        return Math.max(16000, words * 350 + 3000);
    }, []);

    const syncAutoplayRef = useRef<() => void>(() => {});

    const animateSlideChange = useCallback((slideId: string) => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const slider = sliderRef.current;

        animationsRef.current.forEach((animation) => animation.cancel());
        animationsRef.current = [];

        if (reducedMotion || !slider) return;

        const slide = slider.querySelector(`#${slideId}`);

        if (!slide) return;

        const timing: KeyframeAnimationOptions = {
            duration: 500,
            easing: "cubic-bezier(.22,1,.36,1)",
        };

        // Match template: text lifts in; portrait unblurs/scales after is-active is on the DOM.
        slide
            .querySelectorAll(".testimonial-brand, blockquote, figcaption")
            .forEach((element) => {
                animationsRef.current.push(
                    element.animate(
                        [
                            { opacity: 0, transform: "translateY(14px)" },
                            { opacity: 1, transform: "translateY(0)" },
                        ],
                        timing,
                    ),
                );
            });

        const portrait = slide.querySelector(".testimonial-portrait img");

        if (portrait) {
            animationsRef.current.push(
                portrait.animate(
                    [
                        {
                            opacity: 0,
                            filter: "blur(8px)",
                            transform: "scale(1.035)",
                        },
                        {
                            opacity: 1,
                            filter: "blur(0)",
                            transform: "scale(1)",
                        },
                    ],
                    { ...timing, duration: 650 },
                ),
            );
        }
    }, []);

    const showSlide = useCallback((index: number, manual = true) => {
        const next = (index + testimonials.length) % testimonials.length;

        if (next === activeRef.current) {
            syncAutoplayRef.current();
            return;
        }

        activeRef.current = next;
        setActiveIndex(next);

        if (manual && announcementRef.current) {
            announcementRef.current.textContent = `Testimonial ${next + 1} of ${testimonials.length}: ${testimonials[next].name}`;
        }

        syncAutoplayRef.current();
    }, []);

    // Run enter animation only after React has applied `.is-active` (template toggles class sync).
    const hasAnimatedRef = useRef(false);

    useLayoutEffect(() => {
        if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            return;
        }

        animateSlideChange(testimonials[activeIndex].id);
    }, [activeIndex, animateSlideChange]);

    syncAutoplayRef.current = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const slider = sliderRef.current;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (
            pausedRef.current ||
            reducedMotion ||
            !visibleRef.current ||
            hoveringRef.current ||
            document.hidden ||
            (slider && slider.contains(document.activeElement))
        ) {
            return;
        }

        timerRef.current = window.setTimeout(() => {
            showSlide(activeRef.current + 1, false);
        }, getAutoDelay(activeRef.current));
    };

    useEffect(() => {
        pausedRef.current = paused;
        syncAutoplayRef.current();
    }, [paused, showSlide, getAutoDelay]);

    useEffect(() => {
        activeRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        setSliderReady(true);
        setNavVisible(true);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const canvas = canvasRef.current;

        if (!section || !canvas) return;

        return initTestimonialWaves(section, canvas);
    }, []);

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                visibleRef.current = entry.isIntersecting;
                syncAutoplayRef.current();
            },
            { threshold: 0.2 },
        );

        observer.observe(slider);

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handleReducedMotion = () => {
            if (reducedMotion.matches) {
                pausedRef.current = true;
                setPaused(true);
                animationsRef.current.forEach((animation) => animation.cancel());
                animationsRef.current = [];
            }
            syncAutoplayRef.current();
        };

        const handleSync = () => syncAutoplayRef.current();

        reducedMotion.addEventListener("change", handleReducedMotion);
        document.addEventListener("visibilitychange", handleSync);
        window.addEventListener("pageshow", handleSync);

        syncAutoplayRef.current();

        return () => {
            observer.disconnect();
            reducedMotion.removeEventListener("change", handleReducedMotion);
            document.removeEventListener("visibilitychange", handleSync);
            window.removeEventListener("pageshow", handleSync);
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [showSlide, getAutoDelay]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse") {
            pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const pointerStart = pointerStartRef.current;

        if (!pointerStart) return;

        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;

        pointerStartRef.current = null;

        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            showSlide(activeRef.current + (dx < 0 ? 1 : -1));
        }
    };

    return (
        <section
            ref={sectionRef}
            id="client-testimonials"
            className="testimonials"
            aria-labelledby="testimonials-title"
        >
            <div className="testimonial-waves" aria-hidden="true">
                <canvas ref={canvasRef} className="testimonial-waves-canvas" />
            </div>
            <header className="testimonials-heading">
                <p className="testimonials-eyebrow">CLIENT TESTIMONIALS</p>
                <h2 id="testimonials-title">
                    What Our Clients Say{" "}
                    <span>After Go-Live</span>
                </h2>
            </header>
            <div
                ref={sliderRef}
                className={`testimonials-slider${sliderReady ? " is-ready" : ""}`}
                role="region"
                aria-roledescription="carousel"
                aria-label="Client testimonials"
                onKeyDown={(event) => {
                    if (
                        event.altKey ||
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey
                    ) {
                        return;
                    }

                    if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        showSlide(activeRef.current - 1);
                    }

                    if (event.key === "ArrowRight") {
                        event.preventDefault();
                        showSlide(activeRef.current + 1);
                    }
                }}
                onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                        hoveringRef.current = true;
                        syncAutoplayRef.current();
                    }
                }}
                onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") {
                        hoveringRef.current = false;
                        syncAutoplayRef.current();
                    }
                }}
                onFocusCapture={() => syncAutoplayRef.current()}
                onBlurCapture={() => queueMicrotask(() => syncAutoplayRef.current())}
            >
                <div
                    ref={stageRef}
                    className="testimonials-stage"
                    id="testimonial-slides"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => {
                        pointerStartRef.current = null;
                    }}
                >
                    {testimonials.map((testimonial, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <figure
                                key={testimonial.id}
                                id={testimonial.id}
                                className={`testimonial-slide ${testimonial.slideClass}${isActive ? " is-active" : ""}`}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${index + 1} of ${testimonials.length}`}
                                aria-hidden={!isActive}
                                {...(!isActive ? { inert: true } : {})}
                            >
                                <div className="testimonial-brand">
                                    <img
                                        className={testimonial.logoClassName}
                                        src={testimonial.logo}
                                        alt={
                                            index === 0
                                                ? "EVO Grading"
                                                : index === 1
                                                  ? "Polysignals"
                                                  : index === 2
                                                    ? "Zatiq"
                                                    : index === 3
                                                      ? "Gustav"
                                                      : "DITECH"
                                        }
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <span className="testimonial-handle">
                                        {testimonial.handle}
                                    </span>
                                </div>
                                <blockquote>{testimonial.quote}</blockquote>
                                <figcaption>
                                    <strong>{testimonial.name}</strong>
                                    <span>{testimonial.role}</span>
                                </figcaption>
                                <div className="testimonial-portrait">
                                    <img
                                        src={testimonial.portrait}
                                        alt={testimonial.portraitAlt}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            </figure>
                        );
                    })}
                </div>
                <div className="testimonials-navigation" hidden={!navVisible}>
                    <div
                        className="testimonial-pagination"
                        aria-label="Choose a testimonial"
                    >
                        {testimonials.map((testimonial, index) => (
                            <button
                                key={testimonial.id}
                                type="button"
                                className="testimonial-dot"
                                aria-label={`Show ${testimonial.name}'s testimonial`}
                                aria-controls={testimonial.id}
                                aria-current={index === activeIndex ? "true" : undefined}
                                onClick={() => showSlide(index)}
                            >
                                <span />
                            </button>
                        ))}
                    </div>
                    <div className="testimonial-controls">
                        <span className="testimonial-counter" aria-hidden="true">
                            <span>{String(activeIndex + 1).padStart(2, "0")}</span> /{" "}
                            {String(testimonials.length).padStart(2, "0")}
                        </span>
                        <button
                            type="button"
                            className="testimonial-control testimonial-pause"
                            aria-label={
                                paused
                                    ? "Play automatic testimonials"
                                    : "Pause automatic testimonials"
                            }
                            aria-pressed={paused}
                            onClick={() => setPaused((current) => !current)}
                        >
                            <svg
                                className="pause-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M9 6v12M15 6v12"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />
                            </svg>
                            <svg
                                className="play-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="m9 6 9 6-9 6V6Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="testimonial-control testimonial-previous"
                            aria-label="Previous testimonial"
                            aria-controls="testimonial-slides"
                            onClick={() => showSlide(activeRef.current - 1)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="m14 7-5 5 5 5M9 12h10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="testimonial-control testimonial-next"
                            aria-label="Next testimonial"
                            aria-controls="testimonial-slides"
                            onClick={() => showSlide(activeRef.current + 1)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="m10 7 5 5-5 5M5 12h10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <p
                    ref={announcementRef}
                    className="testimonial-announcement"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                />
            </div>
        </section>
    );
};

export default TestimonialsSection;
