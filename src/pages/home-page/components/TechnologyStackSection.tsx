import { useEffect, useRef } from "react";

import flutterLogo from "@/assets/technology/flutter.svg";
import phpLogo from "@/assets/technology/php.svg";
import railsLogo from "@/assets/technology/rails.svg";
import nodejsLogo from "@/assets/technology/nodejs.svg";
import javaLogo from "@/assets/technology/java.svg";
import reactLogo from "@/assets/technology/react.svg";
import dotnetLogo from "@/assets/technology/dotnet.svg";
import pythonLogo from "@/assets/technology/python.svg";
import csharpLogo from "@/assets/technology/csharp.svg";
import laravelLogo from "@/assets/technology/laravel.svg";
import moodleLogo from "@/assets/technology/moodle.svg";
import ionicLogo from "@/assets/technology/ionic.svg";
import golangLogo from "@/assets/technology/golang.svg";
import vueLogo from "@/assets/technology/vuejs.svg";
import androidLogo from "@/assets/technology/android.svg";
import cppLogo from "@/assets/technology/cplusplus.svg";
import javascriptLogo from "@/assets/technology/javascript.svg";
import iosLogo from "@/assets/technology/ios.svg";
import wordpressLogo from "@/assets/technology/wordpress.svg";
import webflowLogo from "@/assets/technology/webflow.svg";
import angularLogo from "@/assets/technology/angular.svg";
import bonotechMark from "@/assets/technology/bonotech-core-mark.svg";

import "./TechnologyStackSection.css";

type Technology = {
    name: string;
    className: string;
    logo: string;
};

const technologies: Technology[] = [
    { name: "Flutter", className: "tech-flutter", logo: flutterLogo },
    { name: "PHP", className: "tech-php", logo: phpLogo },
    { name: "Rails", className: "tech-rails", logo: railsLogo },
    { name: "Node.js", className: "tech-nodejs", logo: nodejsLogo },
    { name: "Java", className: "tech-java", logo: javaLogo },
    { name: "React", className: "tech-react", logo: reactLogo },
    { name: ".NET", className: "tech-dotnet", logo: dotnetLogo },
    { name: "Python", className: "tech-python", logo: pythonLogo },
    { name: "C#", className: "tech-csharp", logo: csharpLogo },
    { name: "Laravel", className: "tech-laravel", logo: laravelLogo },
    { name: "Moodle", className: "tech-moodle", logo: moodleLogo },
    { name: "Ionic", className: "tech-ionic", logo: ionicLogo },
    { name: "Golang", className: "tech-golang", logo: golangLogo },
    { name: "Vue.js", className: "tech-vuejs", logo: vueLogo },
    { name: "Android", className: "tech-android", logo: androidLogo },
    { name: "C++", className: "tech-cplusplus", logo: cppLogo },
    { name: "JavaScript", className: "tech-javascript", logo: javascriptLogo },
    { name: "iOS", className: "tech-ios", logo: iosLogo },
    { name: "WordPress", className: "tech-wordpress", logo: wordpressLogo },
    { name: "Webflow", className: "tech-webflow", logo: webflowLogo },
    { name: "Angular", className: "tech-angular", logo: angularLogo },
];

const orbitItems = [
    { logo: flutterLogo, orbit: 0, duration: "79s", begin: "0.00s" },
    { logo: phpLogo, orbit: 1, duration: "97s", begin: "-8.00s" },
    { logo: railsLogo, orbit: 2, duration: "113s", begin: "-16.00s" },
    { logo: nodejsLogo, orbit: 0, duration: "79s", begin: "-11.29s" },
    { logo: javaLogo, orbit: 1, duration: "97s", begin: "-21.86s" },
    { logo: reactLogo, orbit: 2, duration: "113s", begin: "-32.14s" },
    { logo: dotnetLogo, orbit: 0, duration: "79s", begin: "-22.57s" },
    { logo: pythonLogo, orbit: 1, duration: "97s", begin: "-35.71s" },
    { logo: csharpLogo, orbit: 2, duration: "113s", begin: "-48.29s" },
    { logo: laravelLogo, orbit: 0, duration: "79s", begin: "-33.86s" },
    { logo: moodleLogo, orbit: 1, duration: "97s", begin: "-49.57s" },
    { logo: ionicLogo, orbit: 2, duration: "113s", begin: "-64.43s" },
    { logo: golangLogo, orbit: 0, duration: "79s", begin: "-45.14s" },
    { logo: vueLogo, orbit: 1, duration: "97s", begin: "-63.43s" },
    { logo: androidLogo, orbit: 2, duration: "113s", begin: "-80.57s" },
    { logo: cppLogo, orbit: 0, duration: "79s", begin: "-56.43s" },
    { logo: javascriptLogo, orbit: 1, duration: "97s", begin: "-77.29s" },
    { logo: iosLogo, orbit: 2, duration: "113s", begin: "-96.71s" },
    { logo: wordpressLogo, orbit: 0, duration: "79s", begin: "-67.71s" },
    { logo: webflowLogo, orbit: 1, duration: "97s", begin: "-91.14s" },
    { logo: angularLogo, orbit: 2, duration: "113s", begin: "-112.86s" },
];

const orbitGeometry: [number, number, number][] = [
    [548, 620, 122],
    [485, 636, 107],
    [423, 652, 91],
];

const TechnologyStackSection = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const coreRef = useRef<HTMLDivElement | null>(null);
    const connectionsSvgRef = useRef<SVGSVGElement | null>(null);
    const orbitsSvgRef = useRef<SVGSVGElement | null>(null);
    const wiresRef = useRef<SVGGElement | null>(null);
    const signalsRef = useRef<SVGGElement | null>(null);
    const orbitTrackRefs = useRef<(SVGPathElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
    const connectionRefs = useRef<
        {
            wire: SVGPathElement;
            signal: SVGPathElement;
        }[]
    >([]);

    useEffect(() => {
        const stage = stageRef.current;
        const core = coreRef.current;
        const svg = connectionsSvgRef.current;
        const orbits = orbitsSvgRef.current;
        const wires = wiresRef.current;
        const signals = signalsRef.current;

        if (!stage || !core || !svg || !orbits || !wires || !signals) return;

        const ns = "http://www.w3.org/2000/svg";

        const listenerCleanups: (() => void)[] = [];

        connectionRefs.current = nodeRefs.current.map((node, index) => {
            const wire = document.createElementNS(ns, "path");
            const signal = document.createElementNS(ns, "path");
            wire.setAttribute("class", "tech-wire");
            signal.setAttribute("class", "tech-signal");
            signal.setAttribute("pathLength", "100");
            signal.style.setProperty("--wire-delay", `${-index * 0.61}s`);
            wires.append(wire);
            signals.append(signal);

            const handleEnter = () => {
                wire.classList.add("is-active");
                signal.classList.add("is-active");
            };
            const handleLeave = () => {
                wire.classList.remove("is-active");
                signal.classList.remove("is-active");
            };

            node?.addEventListener("pointerenter", handleEnter);
            node?.addEventListener("pointerleave", handleLeave);
            listenerCleanups.push(() => {
                node?.removeEventListener("pointerenter", handleEnter);
                node?.removeEventListener("pointerleave", handleLeave);
            });

            return { wire, signal };
        });

        const layout = () => {
            const bounds = stage.getBoundingClientRect();
            const hub = core.getBoundingClientRect();

            svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
            orbits.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);

            orbitTrackRefs.current.forEach((track, index) => {
                if (!track) return;
                const [radius, center, height] = orbitGeometry[index];
                const cx = bounds.width / 2;
                const rx = (bounds.width * radius) / 1200;
                const cy = (bounds.height * center) / 780;
                const ry =
                    ((bounds.height * height) / 780) *
                    (bounds.width < 600 ? 0.42 : 1);
                track.setAttribute(
                    "d",
                    `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0`,
                );
            });

            const targetX = hub.left + hub.width / 2 - bounds.left;
            const targetY = hub.top + hub.height / 2 - bounds.top;

            connectionRefs.current.forEach(({ wire, signal }, index) => {
                const node = nodeRefs.current[index];
                const disc = node?.querySelector(".tech-node-disc");

                if (!disc) return;

                const box = disc.getBoundingClientRect();
                const x = box.left + box.width / 2 - bounds.left;
                const y = box.bottom - bounds.top;
                const d = `M${x},${y} C${x},${y + 80} ${targetX + (x - targetX) * 0.13},${targetY - 105} ${targetX},${targetY}`;
                wire.setAttribute("d", d);
                signal.setAttribute("d", d);
            });
        };

        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        let visible = false;

        const sync = () => {
            const active = visible && !document.hidden;
            stage.classList.toggle("is-visible", active);
            if (typeof orbits.pauseAnimations === "function") {
                if (active && !preference.matches) {
                    orbits.unpauseAnimations();
                } else {
                    orbits.pauseAnimations();
                }
            }
        };

        const observer =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                      ([entry]) => {
                          visible = entry.isIntersecting;
                          sync();
                      },
                      { threshold: 0.05 },
                  )
                : null;

        if (observer) {
            observer.observe(stage);
        } else {
            visible = true;
            sync();
        }

        preference.addEventListener("change", sync);
        document.addEventListener("visibilitychange", sync);

        const resizeObserver =
            "ResizeObserver" in window
                ? new ResizeObserver(layout)
                : null;

        if (resizeObserver) {
            resizeObserver.observe(stage);
        } else {
            window.addEventListener("resize", layout, { passive: true });
        }

        document.fonts?.ready.then(layout);
        layout();
        sync();

        return () => {
            observer?.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener("resize", layout);
            preference.removeEventListener("change", sync);
            document.removeEventListener("visibilitychange", sync);
            listenerCleanups.forEach((cleanup) => cleanup());
            connectionRefs.current.forEach(({ wire, signal }) => {
                wire.remove();
                signal.remove();
            });
            connectionRefs.current = [];
        };
    }, []);

    return (
        <section
            id="our-technology"
            className="technology"
            aria-labelledby="technology-title"
        >
            <header className="technology-heading">
                <p className="technology-eyebrow">OUR TECHNOLOGY STACK</p>
                <h2 id="technology-title">
                    The Right Tools
                    <span>Built Around Your Business</span>
                </h2>
                <p className="technology-description">
                    From mobile experiences to enterprise systems,{" "}
                    <br />
                    we bring the right technologies together to build what your
                    business needs
                </p>
            </header>
            <div ref={stageRef} className="tech-stage">
                <div className="tech-ground-glow" aria-hidden="true" />
                <svg
                    ref={connectionsSvgRef}
                    className="tech-connections"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient
                            id="technology-connection-light"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="0" stopColor="#8651cf" stopOpacity="0.25" />
                            <stop offset="0.4" stopColor="#b987f4" />
                            <stop offset="0.65" stopColor="#f0dcff" />
                            <stop offset="1" stopColor="#8954d7" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    <g ref={wiresRef} className="tech-wires" />
                    <g ref={signalsRef} className="tech-signals" />
                </svg>
                <ul className="tech-nodes" aria-label="Technologies we work with">
                    {technologies.map((technology, index) => (
                        <li
                            key={technology.className}
                            ref={(element) => {
                                nodeRefs.current[index] = element;
                            }}
                            className={`tech-node ${technology.className}`}
                            data-tech={technology.className.replace("tech-", "")}
                        >
                            <span className="tech-node-disc">
                                <img
                                    src={technology.logo}
                                    alt=""
                                    width={40}
                                    height={40}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </span>
                            <span className="tech-node-name">{technology.name}</span>
                        </li>
                    ))}
                </ul>
                <svg
                    ref={orbitsSvgRef}
                    className="tech-orbits"
                    viewBox="0 0 1200 780"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient
                            id="technology-orbit-ink"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0" stopColor="#6d419f" stopOpacity="0.12" />
                            <stop offset="0.6" stopColor="#9262c9" stopOpacity="0.58" />
                            <stop offset="1" stopColor="#b683ea" stopOpacity="0.85" />
                        </linearGradient>
                    </defs>
                    <g className="tech-orbit-tracks">
                        {[0, 1, 2].map((index) => (
                            <path
                                key={`orbit-track-${index}`}
                                ref={(element) => {
                                    orbitTrackRefs.current[index] = element;
                                }}
                                id={`technology-orbit-${index}`}
                                d="M52 620a548 122 0 1 0 1096 0a548 122 0 1 0 -1096 0"
                            />
                        ))}
                    </g>
                    <g className="tech-orbit-logos">
                        {orbitItems.map((item, index) => (
                            <g key={`orbit-logo-${index}`} className="tech-orbit-symbol">
                                <image
                                    href={item.logo}
                                    x={-10}
                                    y={-10}
                                    width={20}
                                    height={20}
                                />
                                <animateMotion
                                    dur={item.duration}
                                    begin={item.begin}
                                    repeatCount="indefinite"
                                >
                                    <mpath href={`#technology-orbit-${item.orbit}`} />
                                </animateMotion>
                            </g>
                        ))}
                    </g>
                </svg>
                <div ref={coreRef} className="tech-core">
                    <img
                        src={bonotechMark}
                        alt="Bonotech"
                        width={58}
                        height={43}
                        loading="lazy"
                        decoding="async"
                    />
                    <span aria-hidden="true">BONOTECH</span>
                </div>
            </div>
        </section>
    );
};

export default TechnologyStackSection;
