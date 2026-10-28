import { useRef } from "react";
import FlowBackground from "@/pages/home-page/components/Hero/FlowBackground";
import { useHeroAtmospherePin } from "@/pages/home-page/components/Hero/useHeroAtmospherePin";
import { usePortfolioShift } from "./usePortfolioShift";
import "@/pages/home-page/components/Hero/Hero.css";
import shiftKey from "@/assets/portfolio/shift-key.png";
import "./portfolio-hero.css";

export function PortfolioHero() {
    const heroRef = useRef<HTMLElement>(null);
    const atmosphereRef = useRef<HTMLDivElement>(null);
    const shiftRef = useRef<HTMLAnchorElement>(null);
    usePortfolioShift(shiftRef);
    useHeroAtmospherePin(heroRef, atmosphereRef);

    return (
        <section
            id="portfolio"
            ref={heroRef}
            className="hero portfolio-hero"
            aria-labelledby="portfolio-title"
        >
            <div className="atmosphere" ref={atmosphereRef} aria-hidden="true">
                <div className="background-still" />
                <FlowBackground className="flow-canvas" maxPixelRatio={1.5} ringCenterY={0.43} />
                <div className="readability" />
            </div>
            <div className="hero-clip">
            <div className="portfolio-composition">
                <p className="portfolio-eyebrow">OUR PORTFOLIO</p>
                <h1
                    id="portfolio-title"
                    className="portfolio-title"
                    aria-label="Projects Built To Shift Businesses Forward"
                >
                    <span className="portfolio-title-lead" aria-hidden="true">
                        Projects Built To
                    </span>
                    <span className="portfolio-title-finish">
                        <a
                            ref={shiftRef}
                            className="home-key portfolio-shift"
                            href="#highlighted-projects"
                            aria-label="Shift — explore highlighted projects"
                        >
                            <img
                                src={shiftKey}
                                alt=""
                                width={2303}
                                height={1446}
                                fetchPriority="high"
                                draggable={false}
                            />
                        </a>
                        <span className="portfolio-title-outcome" aria-hidden="true">Businesses Forward</span>
                    </span>
                </h1>
                <p className="portfolio-description">
                    Digital products and enterprise-wide transformations
                    <br className="portfolio-desktop-break" /> engineered by Bonotech
                </p>
            </div>
            </div>
        </section>
    );
}
