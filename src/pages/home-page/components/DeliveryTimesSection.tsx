import { useCallback, useEffect, useRef, useState } from "react";

import websiteVideo from "@/assets/delivery/website-background.mp4";
import appVideo from "@/assets/delivery/mobile-september-background.mp4";
import enterpriseVideo from "@/assets/delivery/enterprise-updated-background.mp4";
import "./DeliveryTimesSection.css";

type DeliveryItem = {
    id: number;
    value: string;
    unit: string;
    descriptionPrefix: string;
    descriptionStrong: string;
    video: string;
    label: string;
    selectLabel: string;
};

const deliveryItems: DeliveryItem[] = [
    {
        id: 0,
        value: "3",
        unit: "Days",
        descriptionPrefix: "Average time to develop a full-fledged",
        descriptionStrong: "website",
        video: websiteVideo,
        label: "Website",
        selectLabel: "Bring website to the center",
    },
    {
        id: 1,
        value: "30",
        unit: "Days",
        descriptionPrefix: "Average time to develop a full",
        descriptionStrong: "mobile + web app",
        video: appVideo,
        label: "Mobile + Web App",
        selectLabel: "Bring mobile + web app to the center",
    },
    {
        id: 2,
        value: "60",
        unit: "Days",
        descriptionPrefix: "Average time to develop",
        descriptionStrong: "enterprise-grade software",
        video: enterpriseVideo,
        label: "Enterprise-Grade Software",
        selectLabel: "Bring enterprise-grade software to the center",
    },
];

function relativeOffset(index: number, center: number, length: number) {
    const offset = (index - center + length) % length;
    return offset === length - 1 ? -1 : offset;
}

function positionFor(index: number, active: number, length: number) {
    const offset = relativeOffset(index, active, length);
    if (offset === 0) return "center";
    if (offset === -1) return "left";
    return "right";
}

const DeliveryTimesSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const glowRef = useRef<HTMLDivElement | null>(null);
    const stageRef = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const wrapAnimationRef = useRef<Animation | null>(null);
    const ignoreClickUntil = useRef(0);
    const dragRef = useRef<{
        id: number;
        x: number;
        y: number;
        dx: number;
        moved: boolean;
    } | null>(null);
    const glowFrameRef = useRef(0);
    const glowPosRef = useRef({ x: 50, y: 55, targetX: 50, targetY: 55 });

    const [active, setActive] = useState(1);
    const [isReady, setIsReady] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [stageFullyVisible, setStageFullyVisible] = useState(false);
    const [videosPaused, setVideosPaused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [announcement, setAnnouncement] = useState("");

    const select = useCallback(
        (index: number, announce = true) => {
            const length = deliveryItems.length;
            const next = (index + length) % length;
            if (next === active) return;

            wrapAnimationRef.current?.cancel();

            if (!reducedMotion) {
                const direction = relativeOffset(next, active, length);
                const wrappingIndex = deliveryItems.findIndex(
                    (_, i) => relativeOffset(i, active, length) === -direction,
                );
                const wrappingCard = stageRef.current?.children[
                    wrappingIndex
                ] as HTMLElement | undefined;

                if (wrappingCard) {
                    const opacity =
                        window.matchMedia("(max-width:700px)").matches
                            ? 0.55
                            : 0.77;
                    wrapAnimationRef.current = wrappingCard.animate(
                        [
                            { opacity },
                            { opacity: 0, offset: 0.16 },
                            { opacity: 0, offset: 0.8 },
                            { opacity },
                        ],
                        { duration: 750, easing: "ease-in-out" },
                    );
                }
            }

            setActive(next);

            if (announce) {
                const item = deliveryItems[next];
                setAnnouncement(
                    `${item.value} ${item.unit}. ${item.descriptionPrefix} ${item.descriptionStrong}`,
                );
            }
        },
        [active, reducedMotion],
    );

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handlePreferenceChange = () => {
            setReducedMotion(preference.matches);
            if (preference.matches) setVideosPaused(true);
        };
        handlePreferenceChange();
        preference.addEventListener("change", handlePreferenceChange);
        return () => preference.removeEventListener("change", handlePreferenceChange);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.05 },
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const observer = new IntersectionObserver(
            ([entry]) => setStageFullyVisible(entry.intersectionRatio >= 0.95),
            { threshold: [0, 0.95] },
        );
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Several videos clipped by the viewport edge at once drop scroll frames
        // (they lose the cheap OS overlay path), so only the centre card plays
        // while the cards are partly off-screen.
        const syncVideos = () => {
            videoRefs.current.forEach((video, index) => {
                if (!video) return;
                video.muted = true;
                const shouldPlay =
                    isVisible &&
                    !document.hidden &&
                    !videosPaused &&
                    !reducedMotion &&
                    (stageFullyVisible || index === active);
                if (shouldPlay) video.play().catch(() => {});
                else video.pause();
            });
        };
        syncVideos();
        document.addEventListener("visibilitychange", syncVideos);
        return () => document.removeEventListener("visibilitychange", syncVideos);
    }, [isVisible, stageFullyVisible, active, videosPaused, reducedMotion]);

    useEffect(() => {
        const section = sectionRef.current;
        const glow = glowRef.current;
        if (!section || !glow) return;

        const followGlow = () => {
            glowFrameRef.current = 0;
            if (!isVisible || document.hidden || reducedMotion) return;
            const pos = glowPosRef.current;
            pos.x += (pos.targetX - pos.x) * 0.075;
            pos.y += (pos.targetY - pos.y) * 0.075;
            glow.style.setProperty("--glow-x", `${pos.x.toFixed(2)}%`);
            glow.style.setProperty("--glow-y", `${pos.y.toFixed(2)}%`);
            if (Math.abs(pos.x - pos.targetX) + Math.abs(pos.y - pos.targetY) > 0.06) {
                glowFrameRef.current = requestAnimationFrame(followGlow);
            }
        };

        const requestGlow = () => {
            if (!glowFrameRef.current && isVisible && !document.hidden && !reducedMotion) {
                glowFrameRef.current = requestAnimationFrame(followGlow);
            }
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" || reducedMotion) return;
            const bounds = section.getBoundingClientRect();
            glowPosRef.current.targetX =
                32 + ((event.clientX - bounds.left) / bounds.width) * 36;
            glowPosRef.current.targetY =
                38 + ((event.clientY - bounds.top) / bounds.height) * 30;
            requestGlow();
        };

        const onLeave = () => {
            glowPosRef.current.targetX = 50;
            glowPosRef.current.targetY = 55;
            requestGlow();
        };

        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);
        if (isVisible) requestGlow();

        return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
            cancelAnimationFrame(glowFrameRef.current);
        };
    }, [isVisible, reducedMotion]);

    const resetDrag = useCallback(() => {
        const stage = stageRef.current;
        const drag = dragRef.current;
        if (!drag || !stage) return;
        const previous = stage.style.translate || "0px 0px";
        stage.style.translate = "";
        if (!reducedMotion && drag.moved) {
            stage.animate(
                [{ translate: previous }, { translate: "0px 0px" }],
                { duration: 400, easing: "cubic-bezier(.22,.7,.14,1)" },
            );
        }
        if (stage.hasPointerCapture(drag.id)) {
            stage.releasePointerCapture(drag.id);
        }
        dragRef.current = null;
        setIsDragging(false);
    }, [reducedMotion]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || !isReady) return;

        const onPointerDown = (event: PointerEvent) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            dragRef.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                dx: 0,
                moved: false,
            };
        };

        const onPointerMove = (event: PointerEvent) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;
            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;
            if (!drag.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
                resetDrag();
                return;
            }
            if (Math.abs(dx) > 9 || drag.moved) {
                drag.moved = true;
                drag.dx = dx;
                stage.setPointerCapture(event.pointerId);
                setIsDragging(true);
                if (!reducedMotion) {
                    stage.style.translate = `${Math.max(-70, Math.min(70, dx * 0.25))}px 0px`;
                }
            }
        };

        const onPointerUp = (event: PointerEvent) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== event.pointerId) return;
            if (drag.moved) {
                ignoreClickUntil.current = performance.now() + 350;
                if (Math.abs(drag.dx) > 40) {
                    select(active + (drag.dx < 0 ? 1 : -1));
                }
            }
            resetDrag();
        };

        stage.addEventListener("pointerdown", onPointerDown);
        stage.addEventListener("pointermove", onPointerMove);
        stage.addEventListener("pointerup", onPointerUp);
        stage.addEventListener("pointercancel", resetDrag);
        window.addEventListener("resize", resetDrag);

        return () => {
            stage.removeEventListener("pointerdown", onPointerDown);
            stage.removeEventListener("pointermove", onPointerMove);
            stage.removeEventListener("pointerup", onPointerUp);
            stage.removeEventListener("pointercancel", resetDrag);
            window.removeEventListener("resize", resetDrag);
        };
    }, [active, isReady, reducedMotion, resetDrag, select]);

    return (
        <section
            ref={sectionRef}
            id="delivery-times"
            className="delivery"
            aria-labelledby="delivery-title"
        >
            <div className="delivery-glow" ref={glowRef} aria-hidden="true" />

            <header className="delivery-heading">
                <p className="delivery-eyebrow">AVERAGE DELIVERY TIMES</p>
                <h2 id="delivery-title">
                    <span className="delivery-title-lead">Built for Momentum</span>
                    <span className="delivery-title-accent">Measured in Days</span>
                </h2>
                <p className="delivery-description">
                    These are Bonotech’s average build times for websites,
                    <br /> mobile and web apps, and enterprise-grade software
                </p>
            </header>

            <div
                className={`delivery-carousel${isReady ? " is-ready" : ""}${isDragging ? " is-dragging" : ""}`}
                role="region"
                aria-roledescription="carousel"
                aria-label="Average delivery times"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
                        return;
                    }
                    if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        select(active - 1);
                    } else if (event.key === "ArrowRight") {
                        event.preventDefault();
                        select(active + 1);
                    }
                }}
            >
                <div className="delivery-stage" ref={stageRef}>
                    {deliveryItems.map((item, index) => (
                        <article
                            key={item.id}
                            className={`delivery-card delivery-${item.id === 0 ? "website" : item.id === 1 ? "apps" : "enterprise"}`}
                            data-position={positionFor(index, active, deliveryItems.length)}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${deliveryItems.length}: ${item.label}`}
                        >
                            <div className="delivery-copy">
                                <h3 className="delivery-time">
                                    {item.value} <span>{item.unit}</span>
                                </h3>
                                <p className="delivery-detail">
                                    {item.descriptionPrefix}{" "}
                                    <strong>{item.descriptionStrong}</strong>
                                </p>
                            </div>
                            <div className="delivery-media" aria-hidden="true">
                                <video
                                    ref={(element) => {
                                        videoRefs.current[index] = element;
                                    }}
                                    src={item.video}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    tabIndex={-1}
                                />
                            </div>
                            <button
                                className="delivery-select"
                                type="button"
                                aria-label={item.selectLabel}
                                aria-pressed={index === active}
                                onClick={() => {
                                    if (performance.now() >= ignoreClickUntil.current) {
                                        select(index);
                                    }
                                }}
                            />
                        </article>
                    ))}
                </div>

                <div className="delivery-navigation" hidden={!isReady}>
                    <button
                        className="delivery-arrow delivery-previous"
                        type="button"
                        aria-label="Previous delivery card"
                        onClick={() => select(active - 1)}
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
                    <div
                        className="delivery-pagination"
                        aria-label="Choose a delivery timeline"
                    >
                        {deliveryItems.map((item, index) => (
                            <button
                                key={item.id}
                                className="delivery-dot"
                                type="button"
                                data-delivery={index}
                                aria-label={`Show ${item.label.toLowerCase()}: ${item.value} days`}
                                aria-current={index === active ? "true" : undefined}
                                onClick={() => select(index)}
                            >
                                <span />
                            </button>
                        ))}
                    </div>
                    <button
                        className="delivery-arrow delivery-next"
                        type="button"
                        aria-label="Next delivery card"
                        onClick={() => select(active + 1)}
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
                    <button
                        className="delivery-video-toggle"
                        type="button"
                        aria-label={
                            videosPaused
                                ? "Play delivery videos"
                                : "Pause delivery videos"
                        }
                        aria-pressed={videosPaused}
                        onClick={() => setVideosPaused((value) => !value)}
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
                </div>

                <p
                    className="delivery-announcement"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {announcement}
                </p>
            </div>
        </section>
    );
};

export default DeliveryTimesSection;
