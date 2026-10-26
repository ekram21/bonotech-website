import { useEffect, useState } from "react";
import { trackCtaClick } from "@/lib/analytics";
import "./expertise-summary.css";

const expertiseServices = [
    {
        title: "Enterprise Software",
        description: "Custom software, legacy modernization, CRM and SaaS solutions.",
        icon: (
            <>
                <path pathLength="1" d="M7 8h34v27H7zM7 15h34M16 41h16M24 35v6" />
                <path pathLength="1" d="m18 21-4 4 4 4m12-8 4 4-4 4m-4-10-4 12" />
                <path pathLength="1" d="M11 11.5h1m3 0h1" />
            </>
        ),
    },
    {
        title: "AI-Native Systems",
        description: "AI-integrated applications and predictive analytics.",
        icon: (
            <>
                <path pathLength="1" d="M16 16h16v16H16zM20 16V7m8 9V7m-8 34v-9m8 9v-9M7 20h9m-9 8h9m16-8h9m-9 8h9" />
                <path pathLength="1" d="m24 20 1.2 2.8L28 24l-2.8 1.2L24 28l-1.2-2.8L20 24l2.8-1.2L24 20Z" />
                <path pathLength="1" d="M5 18h2v4H5zm36 8h2v4h-2zM18 5h4v2h-4zm8 36h4v2h-4z" />
            </>
        ),
    },
    {
        title: "Business Automation",
        description: "Workflow automation and robotic process automation (RPA).",
        icon: (
            <>
                <path pathLength="1" d="M5 6h13v13H5zM30 29h13v13H30z" />
                <path pathLength="1" d="M18 12h12a7 7 0 0 1 7 7v5m-5-5 5 5 5-5" />
                <path pathLength="1" d="M30 36H18a7 7 0 0 1-7-7v-5m-5 5 5-5 5 5" />
                <path pathLength="1" d="m34 35 2 2 4-4" />
            </>
        ),
    },
    {
        title: "AI Harness & MCP",
        description: "AI harnesses bring business data and tools together. MCP integrations connect them to compatible AI agents.",
        icon: (
            <>
                <path pathLength="1" d="M18 18h12v12H18zM5 5h8v8H5zm30 0h8v8h-8zM5 35h8v8H5zm30 0h8v8h-8z" />
                <path pathLength="1" d="m13 13 5 5m12 0 5-5M13 35l5-5m12 0 5 5M21 24h6m-3-3v6" />
            </>
        ),
    },
];

export default function ExpertiseSummarySection() {
    const [isInView, setIsInView] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(() => !document.hidden);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        const section = document.getElementById("expertise-summary");
        if (!section || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.08 },
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotion = () => setPrefersReducedMotion(motionQuery.matches);
        const updateVisibility = () => setIsDocumentVisible(!document.hidden);

        motionQuery.addEventListener("change", updateMotion);
        document.addEventListener("visibilitychange", updateVisibility);
        return () => {
            motionQuery.removeEventListener("change", updateMotion);
            document.removeEventListener("visibilitychange", updateVisibility);
        };
    }, []);

    const atmosphereActive = isInView && isDocumentVisible && !prefersReducedMotion;

    return (
        <section
            id="expertise-summary"
            className={`expertise-summary${atmosphereActive ? " is-in-view" : ""}`}
            aria-labelledby="expertise-summary-title"
        >
            <div className="expertise-atmosphere" aria-hidden="true">
                <div className="expertise-haze expertise-haze-one" />
                <div className="expertise-haze expertise-haze-two" />
                <div className="expertise-haze expertise-haze-three" />
            </div>

            <div className="expertise-summary-inner">
                <header className="expertise-summary-heading">
                    <p className="expertise-summary-eyebrow">OUR EXPERTISE</p>
                    <h2 id="expertise-summary-title">
                        <span className="expertise-title-line">Enterprise Software</span>
                        <span className="expertise-title-line expertise-title-accent">
                            AI-Native Systems
                        </span>
                    </h2>
                    <p className="expertise-summary-copy">
                        We engineer custom enterprise software and AI-native systems, from legacy
                        modernization and AI-integrated applications to workflow automation,
                        predictive analytics, RPA, CRM and SaaS solutions.
                    </p>
                </header>

                <div className="expertise-services">
                    {expertiseServices.map((service) => (
                        <article className="expertise-service" key={service.title}>
                            <svg
                                className="expertise-service-icon"
                                viewBox="0 0 48 48"
                                fill="none"
                                aria-hidden="true"
                            >
                                {service.icon}
                            </svg>
                            <div className="expertise-service-rule" aria-hidden="true" />
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>

                <a
                    className="expertise-summary-cta"
                    href="#discovery-call"
                    onClick={() => trackCtaClick("expertise_summary_discovery")}
                >
                    <span>Book a Discovery Call</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M5 15 15 5M5 5h10v10" />
                    </svg>
                </a>

                <div className="expertise-summary-security">
                    <svg
                        className="expertise-security-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path pathLength="1" d="m12 3 8 3v6c0 4.5-8 9-8 9s-8-4.5-8-9V6l8-3Z" />
                        <path pathLength="1" d="M9.5 11V9a2.5 2.5 0 0 1 5 0v2M8.5 11h7v6h-7z" />
                    </svg>
                    <p>
                        We build information security and personal data protection into our
                        engineering approach, helping businesses meet applicable GDPR requirements.
                    </p>
                </div>
            </div>
        </section>
    );
}
