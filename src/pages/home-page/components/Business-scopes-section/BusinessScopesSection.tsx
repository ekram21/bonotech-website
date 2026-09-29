import { useEffect, useRef } from "react";

import aiStar from "@/assets/ways-in/ai-star.svg";

import "./BusinessScopesSection.css";

const BusinessScopesSection = () => {
    const gridRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const grid = gridRef.current;

        if (!grid) return;

        if (!("IntersectionObserver" in window)) {
            grid.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                grid.classList.toggle("is-visible", entry.isIntersecting);
            },
            { threshold: 0.05 },
        );

        observer.observe(grid);

        return () => observer.disconnect();
    }, []);

    return (
        <section id="ways-in" className="ways-in" aria-labelledby="ways-title">
            <header className="ways-heading">
                <p className="ways-eyebrow">OUR SERVICE SCOPE</p>
                <h2 id="ways-title">
                    We Offer 4 Scopes
                    <span>Depending On Where You&apos;re Starting</span>
                </h2>
                <p className="ways-description">
                    From the first idea to enterprise-wide transformation,
                    <br />
                    we meet your business where it is and build what comes next.
                </p>
            </header>
            <div ref={gridRef} className="scope-grid">
                <div className="scope-art" aria-hidden="true">
                    <div className="scope-halo" />
                    <div className="scope-star">
                        <img
                            src={aiStar}
                            alt=""
                            width={366}
                            height={382}
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>
                <div className="scope-grid-lines" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                </div>
                <article
                    className="scope-card scope-idea"
                    aria-labelledby="way-map-title"
                >
                    <h3 id="way-map-title">
                        You Just Have An Idea
                        <br />
                        That Needs Clear Direction
                    </h3>
                    <p>
                        We understand the problem, map the workflows, define the product
                        and shape the full build plan with you. Once approved, we turn it
                        into a working digital product.
                    </p>
                </article>
                <article
                    className="scope-card scope-build"
                    aria-labelledby="way-launch-title"
                >
                    <h3 id="way-launch-title">
                        Your App Idea Is Clear
                        <br />
                        You Need It Built
                    </h3>
                    <p>
                        We&apos;ll deploy a solid team to build across mobile, web, cloud and
                        AI, and work in gated phases with weekly shippable increments. 5 of
                        our 7 platforms went live in just 30 days or less.
                    </p>
                </article>
                <div className="scope-notification">
                    <div className="scope-notification-meta">
                        <span className="scope-notification-mark" aria-hidden="true">
                            ✦
                        </span>
                        <span>BONOTECH</span>
                        <span className="scope-notification-signal" aria-hidden="true" />
                    </div>
                    <p>AI-accelerated technology for any and every business need</p>
                </div>
                <article
                    className="scope-card scope-consult"
                    aria-labelledby="way-connect-title"
                >
                    <h3 id="way-connect-title">
                        Your Enterprise
                        <br />
                        Needs Consultation
                    </h3>
                    <p>
                        We assess your systems, workflows, internal teams and delivery
                        processes to identify gaps, validate whether everything is on the
                        right track, and recommend the best-fitting next actions.
                    </p>
                </article>
                <article
                    className="scope-card scope-digitize"
                    aria-labelledby="way-digitization-title"
                >
                    <h3 id="way-digitization-title">
                        Your Enterprise Needs
                        <br />
                        End-To-End Digitization
                    </h3>
                    <p>
                        We digitize fragmented, aging legacy systems across your
                        enterprise into one digital flow, giving your teams and management
                        real-time visibility, actionable insights, and the ability to
                        manage operations through simple, natural-language conversations.
                    </p>
                </article>
            </div>
        </section>
    );
};

export default BusinessScopesSection;
