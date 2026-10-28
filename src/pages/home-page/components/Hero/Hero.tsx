import { useEffect, useState } from "react";
import clockArtwork from "@/assets/hero/layered-clock/clock-photoshop-shadow-v2.png";
import FlowBackground from "./FlowBackground";
import "./ClockHero.css";

const COMPACT_HERO_QUERY = "(max-width: 1100px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function useMediaQuery(query: string, fallback = false) {
    const [matches, setMatches] = useState(fallback);

    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, [query]);

    return matches;
}

const Hero = () => {
    const isCompact = useMediaQuery(COMPACT_HERO_QUERY);
    const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
    const [motionPaused, setMotionPaused] = useState(prefersReducedMotion);

    useEffect(() => {
        setMotionPaused(prefersReducedMotion);
    }, [prefersReducedMotion]);

    return (
        <section id="home" className="clock-hero" aria-labelledby="hero-title">
            <div className="clock-scene" aria-hidden="true">
                <div className="clock-wave-layer">
                    <FlowBackground
                        className="clock-wave-canvas"
                        paused={motionPaused}
                        ringCenterY={0.45}
                    />
                </div>
            </div>

            <h1 id="hero-title" className="clock-title">
                <span>Our Engineering Is So Fast</span>
                <span>We Are Melting The Concept Of Time</span>
            </h1>

            <svg
                className="clock-product-layer"
                viewBox={isCompact ? "480 447 735 266" : "0 0 1672 940"}
                preserveAspectRatio={isCompact ? "xMidYMid meet" : "xMidYMid slice"}
                focusable="false"
                aria-hidden="true"
            >
                <defs>
                    <image
                        id="hero-clock-artwork"
                        href={clockArtwork}
                        width="1672"
                        height="940"
                    />
                    <filter
                        id="hero-clock-reflection-blur"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                    >
                        <feGaussianBlur stdDeviation="2.2" />
                    </filter>
                    <linearGradient
                        id="hero-clock-reflection-fade"
                        x1="0"
                        y1="713"
                        x2="0"
                        y2={isCompact ? "793" : "887"}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="white" />
                        <stop offset=".5" stopColor="white" stopOpacity=".4" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <mask
                        id="hero-clock-reflection-mask"
                        maskUnits="userSpaceOnUse"
                        x="561"
                        y="713"
                        width="582"
                        height="200"
                    >
                        <rect
                            x="561"
                            y="713"
                            width="582"
                            height="200"
                            fill="url(#hero-clock-reflection-fade)"
                        />
                    </mask>
                </defs>
                <g
                    className="clock-reflection-plane"
                    mask="url(#hero-clock-reflection-mask)"
                    opacity=".3"
                >
                    <use
                        className="clock-reflection-image"
                        href="#hero-clock-artwork"
                        transform={
                            isCompact
                                ? "translate(0 926.9) scale(1 -3)"
                                : "translate(0 1176.45) scale(1 -65)"
                        }
                        filter="url(#hero-clock-reflection-blur)"
                    />
                </g>
                <use href="#hero-clock-artwork" />
            </svg>

            <div className="clock-support">
                <p className="intro-copy clock-copy-left">
                    Bonotech turns <strong>complex business needs</strong> into{" "}
                    <strong>custom software</strong> and{" "}
                    <strong>connected digital operations,</strong> engineered with{" "}
                    <strong>precision</strong> and delivered at
                    <br />
                    <strong>exceptional&nbsp;speed</strong>
                </p>
                <p className="intro-copy clock-copy-right">
                    <strong>AI works best</strong> with the right{" "}
                    <strong>business context</strong> We connect it to your{" "}
                    <strong>data, documents and everyday workflows</strong> through{" "}
                    <strong>custom AI systems</strong> and <strong>MCP</strong>
                    <br />
                    <strong>integrations</strong>
                </p>
            </div>

            <div className="clock-hero-bottom">
                <button
                    id="motion-toggle"
                    className="clock-motion-toggle"
                    type="button"
                    aria-label={motionPaused ? "Play background animation" : "Pause background animation"}
                    aria-pressed={motionPaused}
                    title={motionPaused ? "Play background animation" : "Pause background animation"}
                    onClick={() => setMotionPaused((paused) => !paused)}
                >
                    <svg className="clock-pause-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <rect x="5" y="4" width="3" height="12" rx=".7" />
                        <rect x="12" y="4" width="3" height="12" rx=".7" />
                    </svg>
                    <svg className="clock-play-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6 3.5 16 10 6 165z" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default Hero;
