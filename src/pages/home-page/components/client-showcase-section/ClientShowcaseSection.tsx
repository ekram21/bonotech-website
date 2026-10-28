import { useEffect, useRef, useState } from "react";
import "./ClientShowcaseSection.css";

import getMyGrailLogo from "@/assets/clients/get-my-grail.svg";
import ditechLogo from "@/assets/clients/ditech.svg";
import gustavLogo from "@/assets/clients/gustav.svg";
import olmoLogo from "@/assets/clients/olmo.svg";
import dekkoIshoLogo from "@/assets/clients/dekko-isho.svg";
import evoLogo from "@/assets/clients/evo.webp";
import polysignalsLogo from "@/assets/clients/polysignals.svg";
import zatiqLogo from "@/assets/clients/zatiq.svg";

type Client = {
    name: string;
    logo: string;
    className: string;
    width: number;
    height: number;
    href: string;
};

type Movement = {
    from: number;
    to: number;
    elapsed: number;
};

type ClientGeometry = {
    count: number;
    halfCount: number;
    spacing: number;
    normalizationWidth: number;
};

const AUTO_ADVANCE_SECONDS = 5.5;
const MANUAL_MOVE_MS = 950;
const MAX_FRAME_DELTA_SECONDS = 0.06;

const clients: Client[] = [
    {
        name: "Get My Grail",
        logo: getMyGrailLogo,
        className: "logo-grail",
        width: 316,
        height: 141,
        href: "https://divc-milio.web.app/",
    },
    {
        name: "DITECH",
        logo: ditechLogo,
        className: "logo-ditech",
        width: 633,
        height: 120,
        href: "https://www.ditech.co/",
    },
    {
        name: "Gustav",
        logo: gustavLogo,
        className: "logo-gustav",
        width: 454,
        height: 134,
        href: "https://gustav.club",
    },
    {
        name: "Olmo",
        logo: olmoLogo,
        className: "logo-olmo",
        width: 422,
        height: 138,
        href: "https://olmo.homes",
    },
    {
        name: "Dekko ISHO",
        logo: dekkoIshoLogo,
        className: "logo-dekko",
        width: 362,
        height: 139,
        href: "https://dekko-isho-group.web.app/",
    },
    {
        name: "EVO",
        logo: evoLogo,
        className: "logo-evo",
        width: 118,
        height: 138,
        href: "https://evocardprep.com",
    },
    {
        name: "Polysignals",
        logo: polysignalsLogo,
        className: "logo-polysignals",
        width: 643,
        height: 85,
        href: "https://polysignals.app",
    },
    {
        name: "Zatiq",
        logo: zatiqLogo,
        className: "logo-zatiq",
        width: 109.37,
        height: 40.64,
        href: "https://zatiq.com",
    },
];

const ClientShowcaseSection = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const orbitRef = useRef<HTMLUListElement | null>(null);
    const controlsRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const phaseRef = useRef(0);
    const geometryRef = useRef<ClientGeometry>({
        count: clients.length,
        halfCount: clients.length / 2,
        spacing: 0,
        normalizationWidth: 360,
    });

    const visibleRef = useRef(false);
    const hoveredRef = useRef(false);
    const focusedRef = useRef(false);
    const userPausedRef = useRef(false);

    const lastRef = useRef(0);
    const frameRef = useRef(0);

    const movementRef = useRef<Movement | null>(null);

    const [isPaused, setIsPaused] = useState(false);
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        const section = sectionRef.current;
        const orbit = orbitRef.current;
        const controls = controlsRef.current;
        const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];

        if (!section || !orbit || !controls || !cards.length) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const renderedLights = new Array<number>(cards.length);
        const renderedZIndices = new Array<number>(cards.length);

        section.classList.add("is-enhanced");
        controls.hidden = false;

        const render = () => {
            const geometry = geometryRef.current;
            const phase = phaseRef.current;

            cards.forEach((card, index) => {
                const slot =
                    ((index - phase + geometry.halfCount) % geometry.count +
                        geometry.count) %
                        geometry.count -
                    geometry.halfCount;
                const x = slot * geometry.spacing;
                const across = Math.max(
                    -1,
                    Math.min(1, x / geometry.normalizationWidth),
                );
                const recess = Math.max(0, 1 - across * across);
                const y = recess * 18;
                const z = -320 * recess;
                const angle = -across * 28;
                const light = Math.round((1 - 0.1 * recess) * 1000) / 1000;
                const zIndex = Math.round(1000 + z);

                card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${angle.toFixed(2)}deg)`;

                if (renderedLights[index] !== light) {
                    card.style.setProperty("--recess-shade", (1 - light).toFixed(3));
                    renderedLights[index] = light;
                }

                if (renderedZIndices[index] !== zIndex) {
                    card.style.zIndex = String(zIndex);
                    renderedZIndices[index] = zIndex;
                }
            });
        };

        const size = () => {
            const stageWidth = orbit.clientWidth;
            const firstCard = cards[0];
            const cardWidth = firstCard?.offsetWidth ?? 0;
            const count = cards.length;

            geometryRef.current = {
                count,
                halfCount: count / 2,
                spacing: Math.max(
                    cardWidth + 58,
                    (stageWidth + cardWidth * 2.4) / count,
                ),
                normalizationWidth: Math.max(stageWidth * 0.55, 360),
            };

            render();
        };

        const syncPause = () => {
            setIsPaused(userPausedRef.current);
        };

        const announceSelection = () => {
            const index =
                ((Math.round(phaseRef.current) % cards.length) + cards.length) %
                cards.length;

            const brand = cards[index]?.dataset.brand ?? "";

            setAnnouncement(brand);
        };

        const go = (direction: number) => {
            const movement = movementRef.current;

            const destination =
                (movement ? movement.to : Math.round(phaseRef.current)) + direction;

            userPausedRef.current = true;

            syncPause();

            if (reduced.matches) {
                phaseRef.current = destination;
                movementRef.current = null;

                render();
                announceSelection();

                return;
            }

            movementRef.current = {
                from: phaseRef.current,
                to: destination,
                elapsed: 0,
            };
        };

        const handlePrevious = () => {
            go(-1);
        };

        const handleNext = () => {
            go(1);
        };

        const handleToggle = () => {
            userPausedRef.current = !userPausedRef.current;

            if (!userPausedRef.current) {
                focusedRef.current = false;
            }

            lastRef.current = performance.now();
            syncPause();
        };

        const handlePointerEnter = (event: PointerEvent) => {
            if (event.pointerType !== "touch") {
                hoveredRef.current = true;
            }
        };

        const handlePointerLeave = () => {
            hoveredRef.current = false;
            lastRef.current = performance.now();
        };

        const handleFocusIn = () => {
            focusedRef.current = true;
        };

        const handleFocusOut = (event: FocusEvent) => {
            focusedRef.current = controls.contains(event.relatedTarget as Node);
            lastRef.current = performance.now();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            event.preventDefault();

            go(event.key === "ArrowRight" ? 1 : -1);
        };

        const handleReducedMotionChange = () => {
            const movement = movementRef.current;

            if (movement) {
                phaseRef.current = movement.to;
                movementRef.current = null;
            }

            lastRef.current = performance.now();
            render();
        };

        const handleVisibilityChange = () => {
            lastRef.current = performance.now();
            syncTick();
        };

        let intersectionObserver: IntersectionObserver | null = null;

        const resizeObserver = new ResizeObserver(size);

        resizeObserver.observe(orbit);

        const syncTick = () => {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
            lastRef.current = performance.now();
            if (!document.hidden && visibleRef.current) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };

        const tick = (now: number) => {
            frameRef.current = 0;

            if (document.hidden || !visibleRef.current) {
                lastRef.current = now;
                return;
            }

            frameRef.current = requestAnimationFrame(tick);

            const previous = lastRef.current;
            lastRef.current = now;

            const dt = previous
                ? Math.min((now - previous) / 1000, MAX_FRAME_DELTA_SECONDS)
                : 0;

            const movement = movementRef.current;

            if (movement) {
                movement.elapsed += dt * 1000;

                const t = Math.min(movement.elapsed / MANUAL_MOVE_MS, 1);

                const ease =
                    t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;

                phaseRef.current =
                    movement.from + (movement.to - movement.from) * ease;

                if (t === 1) {
                    phaseRef.current =
                        ((movement.to % cards.length) + cards.length) % cards.length;
                    movementRef.current = null;
                    announceSelection();
                }

                render();
            } else if (
                !userPausedRef.current &&
                !hoveredRef.current &&
                !focusedRef.current &&
                !reduced.matches
            ) {
                phaseRef.current =
                    (phaseRef.current + dt / AUTO_ADVANCE_SECONDS) % cards.length;

                render();
            }
        };

        if ("IntersectionObserver" in window) {
            intersectionObserver = new IntersectionObserver(
                ([entry]) => {
                    visibleRef.current = entry.isIntersecting;
                    lastRef.current = performance.now();
                    syncTick();
                },
                {
                    threshold: 0.01,
                    rootMargin: "10% 0px",
                },
            );

            intersectionObserver.observe(section);
        } else {
            visibleRef.current = true;
        }

        const previousButton = section.querySelector(
            "#client-previous",
        ) as HTMLButtonElement | null;

        const nextButton = section.querySelector(
            "#client-next",
        ) as HTMLButtonElement | null;

        const toggleButton = section.querySelector(
            "#client-motion",
        ) as HTMLButtonElement | null;

        previousButton?.addEventListener("click", handlePrevious);
        nextButton?.addEventListener("click", handleNext);
        toggleButton?.addEventListener("click", handleToggle);

        orbit.addEventListener("pointerenter", handlePointerEnter);
        orbit.addEventListener("pointerleave", handlePointerLeave);

        controls.addEventListener("focusin", handleFocusIn);
        controls.addEventListener("focusout", handleFocusOut);
        controls.addEventListener("keydown", handleKeyDown);

        reduced.addEventListener("change", handleReducedMotionChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        size();
        syncPause();
        syncTick();

        return () => {
            section.classList.remove("is-enhanced");

            cancelAnimationFrame(frameRef.current);

            resizeObserver.disconnect();
            intersectionObserver?.disconnect();

            previousButton?.removeEventListener("click", handlePrevious);
            nextButton?.removeEventListener("click", handleNext);
            toggleButton?.removeEventListener("click", handleToggle);

            orbit.removeEventListener("pointerenter", handlePointerEnter);
            orbit.removeEventListener("pointerleave", handlePointerLeave);

            controls.removeEventListener("focusin", handleFocusIn);
            controls.removeEventListener("focusout", handleFocusOut);
            controls.removeEventListener("keydown", handleKeyDown);

            reduced.removeEventListener("change", handleReducedMotionChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="our-clients"
            className="clients"
            aria-labelledby="clients-title"
        >
            <header className="clients-heading">
                <p className="clients-eyebrow">
                    BRANDS WE’VE BUILT WITH
                </p>

                <h2 id="clients-title">
                    Different Businesses
                    <br />
                    <span>A Shared Drive Forward</span>
                </h2>

                <p className="clients-description">
                    From growing platforms to enterprise teams, we build for the way each
                    business works
                </p>
            </header>

            <div className="client-stage">
                <div className="client-recess" aria-hidden="true" />

                <ul
                    ref={orbitRef}
                    className="client-orbit"
                    aria-label="Selected clients"
                >
                    {clients.map((client, index) => (
                        <li
                            key={client.name}
                            ref={(element) => {
                                cardRefs.current[index] = element;
                            }}
                            className="client-logo"
                            data-brand={client.name}
                        >
                            <a
                                className="client-face"
                                href={client.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${client.name} (opens in a new tab)`}
                            >
                                <img
                                    className={client.className}
                                    src={client.logo}
                                    alt=""
                                    width={client.width}
                                    height={client.height}
                                    loading="eager"
                                    decoding="async"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                ref={controlsRef}
                className="client-controls"
                hidden
            >
                <button
                    className="client-control"
                    id="client-previous"
                    type="button"
                    aria-label="Show previous client"
                >
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="m12 5-5 5 5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>

                <button
                    className="client-control client-motion"
                    id="client-motion"
                    type="button"
                    aria-label={
                        isPaused
                            ? "Play logo animation"
                            : "Pause logo animation"
                    }
                    aria-pressed={isPaused}
                >
                    <svg
                        className="client-pause-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <rect
                            x="6"
                            y="5"
                            width="2"
                            height="10"
                            rx=".5"
                        />

                        <rect
                            x="12"
                            y="5"
                            width="2"
                            height="10"
                            rx=".5"
                        />
                    </svg>

                    <svg
                        className="client-play-icon"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="m7 4 9 6-9 6z" />
                    </svg>
                </button>

                <button
                    className="client-control"
                    id="client-next"
                    type="button"
                    aria-label="Show next client"
                >
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="m8 5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>

                <span
                    className="client-announcement"
                    role="status"
                    aria-live="polite"
                >
                    {announcement}
                </span>
            </div>
        </section>
    );
};

export default ClientShowcaseSection;
