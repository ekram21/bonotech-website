import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ProjectsProps, ProjectCardData } from "./Projects.types";
import { ProjectCard } from "./components/ProjectCard";

// Asset imports
import gustavMockup from "@/assets/projects/gustav-mockup.png";
import gustavIcon from "@/assets/projects/gustav-icon.png";
import gustavLogo from "@/assets/projects/gustav-logo.png";
import olmoMockup from "@/assets/projects/olmo-mockup.png";
import olmoIcon from "@/assets/projects/olmo-icon.svg";
import olmoLogo from "@/assets/projects/olmo-logo.png";
import milioMockup from "@/assets/projects/milio-mockup.png";
import milioLogo from "@/assets/projects/milio-logo.svg";
import milioIcon from "@/assets/projects/milio-icon.svg";

const PROJECTS: ProjectCardData[] = [
  {
    id: "gustav",
    category: "Travel & Tourism",
    title: "Gustav, Hotel Companion Mobile App",
    subtitle:
      "This app is your travel companion, offering everything from booking to check-out. Enjoy room service, concierge help, and local tips for a smooth stay.",
    backgroundColor: "#FAF1E9",
    borderColor: "#D2CBC5",
    buttonColor: "#C0A080",
    mockupSrc: gustavMockup,
    iconSrc: gustavIcon,
    logoSrc: gustavLogo,
    logoAlt: "Gustav logo",
    logoWidth: 240,
    logoHeight: 78,
    playStoreHref:
      "https://play.google.com/store/apps/details?id=com.ekram211.zen",
    appStoreHref: "https://apps.apple.com/ae/app/gustav/id6738002227",
    learnMoreHref: "#",
    opacity: 90,
  },
  {
    id: "olmo",
    category: "Real Estate",
    title: "Olmo, Property Management Mobile App",
    subtitle:
      "Olmo transforms real estate management by streamlining tenant communication, maintenance, and financial tracking. Making property management easier for all and gives new experience.",
    backgroundColor: "#A2A5AA",
    borderColor: "#A6A9AD",
    buttonColor: "#2D343C",
    mockupSrc: olmoMockup,
    iconSrc: olmoIcon,
    logoSrc: olmoLogo,
    logoAlt: "Olmo logo",
    logoWidth: 166.43,
    logoHeight: 124.11,
    playStoreHref:
      "https://play.google.com/store/apps/details?id=com.bonoholdings.proptech",
    appStoreHref: "https://apps.apple.com/gb/app/olmo-homes/id6747893455",
    learnMoreHref: "#",
    opacity: 100,
  },
  {
    id: "milio",
    category: "Collectibles",
    title: "Where collectors Can buy their Collectibles",
    subtitle:
      "Milio is a game changing platform for collectors, helping them buy smarter and sell quicker. Its easy-to-use interface makes managing collectibles simple, allowing users to trade and sell with fellow enthusiasts. Whether you're expanding your collection or seeking the ideal buyer, we provides the tools to elevate your collecting journey.",
    backgroundColor: "#D8D8D8",
    borderColor: "#D4D4D4",
    buttonColor: "#333333",
    mockupSrc: milioMockup,
    iconSrc: milioIcon,
    iconWidth: 765,
    logoSrc: milioLogo,
    logoAlt: "Milio logo",
    logoDark: true,
    logoWidth: 164.77,
    logoHeight: 56,
    playStoreHref: undefined,
    appStoreHref: undefined,
    learnMoreHref: "#",
    opacity: 35,
  },
];

/** Fixed height of the site navbar (px) */
const NAVBAR_H = 80;
/** Vertical padding around title block (px) */
const TITLE_BOTTOM_MARGIN = 16;
/** Degrees to rotate stacked cards (alternates ±) */
const CARD_ROTATION = 2;
/**
 * Minimum viewport width (px) to use the scroll-driven stacking layout.
 * Below this we fall back to the simple mobile stack.
 */
const DESKTOP_BREAKPOINT = 768;

export function Projects({ className }: ProjectsProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  /*
   * Initialise eagerly from window so the correct layout (desktop vs mobile)
   * is rendered on the very first pass and refs are populated before the
   * browser paints.
   */
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= DESKTOP_BREAKPOINT,
  );
  const [dims, setDims] = useState(() => ({
    titleH: 200,
    cardH: 600,
    viewportH: window.innerHeight,
    viewportW: window.innerWidth,
  }));

  /* ── Measure on mount / resize ── */
  /*
   * useLayoutEffect fires synchronously after the DOM is committed but
   * BEFORE the browser paints.  Because isDesktop is now initialised
   * eagerly, the desktop layout (and its refs) is already in the DOM when
   * this effect runs, so we always get real offsetHeight values and
   * stickyScale is correct on the very first frame.
   */
  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIsDesktop(vw >= DESKTOP_BREAKPOINT);
      setDims({
        titleH: titleRef.current?.offsetHeight ?? 200,
        cardH: firstCardRef.current?.offsetHeight ?? 600,
        viewportH: vh,
        viewportW: vw,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { titleH, cardH, viewportH } = dims;

  /* Visible height of the card-stacking viewport */
  const cardAreaH = cardH;

  /* Scroll distance allocated per card entering the stack (unscaled) */
  const scrollPerCard = isDesktop
    ? Math.max(cardH * 1.5, 600)
    : Math.max(cardH * 0.5, 300);

  /* Height of what the sticky wrapper "displays" (before scaling) */
  const stickyContentH = titleH + TITLE_BOTTOM_MARGIN + cardAreaH;

  /*
   * Scale the sticky block down so title + cards always fit within
   * the visible viewport regardless of zoom level or screen size.
   * We leave a generous 48 px buffer below, plus the navbar height.
   */
  const availableH = Math.max(viewportH - NAVBAR_H - 48, 320);
  const stickyScale =
    stickyContentH > 0 ? Math.min(1, availableH / stickyContentH) : 1;

  /*
   * When stickyScale < 1 the content appears shorter on screen than its
   * CSS layout height, so we need MORE scroll distance per card to make
   * each animation feel the same length visually.
   *
   * This value is used BOTH for the runway height and the animation
   * progress calculation so they always agree.
   */
  const effectiveScrollPerCard = scrollPerCard / stickyScale;

  /* Total scroll consumed animating cards 2…N into view */
  const totalCardScroll = effectiveScrollPerCard * (PROJECTS.length - 1);

  /* Total runway height: sticky content + scale-compensated animation room */
  const runwayH = stickyContentH + totalCardScroll;

  /* ── Scroll-driven card animation ── */
  useEffect(() => {
    let rafId: number;

    const update = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();

      /* progress = how many px the runway has scrolled past the navbar pin point */
      const progress = Math.max(0, NAVBAR_H - rect.top);

      cardEls.current.forEach((el, i) => {
        if (!el) return;

        /* First card is always pinned at the top */
        if (i === 0) {
          el.style.transform = "translateY(0px)";
          return;
        }

        const animStart = (i - 1) * effectiveScrollPerCard;
        const t = Math.min(
          1,
          Math.max(0, (progress - animStart) / effectiveScrollPerCard),
        );

        const entryY = cardAreaH + 100; // start below clip edge
        const y = entryY + (0 - entryY) * t; // animate toward 0

        /* Alternating rotation when fully stacked */
        const sign = i % 2 === 0 ? 1 : -1;
        const rotation = isDesktop && t >= 1 ? sign * CARD_ROTATION : 0;
        el.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // set initial positions
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop, effectiveScrollPerCard, cardAreaH, stickyScale]);

  /* Shared section heading — identical class to the original */
  const SectionHeading = ({ id }: { id?: string }) => (
    <h2
      id={id}
      className="font-body font-semibold text-center text-[clamp(64px,10vw,128px)] leading-[1.15] tracking-normal bg-[linear-gradient(0deg,rgba(130,105,207,0.3)_0%,rgba(60,0,245,0.6)_100%)] bg-clip-text text-transparent"
    >
      Projects
    </h2>
  );

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={cn(
        "relative w-full bg-surface-neutral pt-28 lg:pb-28 pb-0",
        className,
      )}
    >
      {/* ── Mobile layout: plain stacked cards, no animation ── */}
      {!isDesktop && (
        <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
          <div className="flex flex-col items-center select-none pb-12">
            <SectionHeading id="projects-heading" />
          </div>
          <div className="flex flex-col gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* ── Desktop layout: scroll-driven stacking animation ── */}
      {isDesktop && (
        <>
          {/* Scroll runway — oversized so the sticky wrapper stays pinned
              for the full card-animation duration */}
          <div
            ref={runwayRef}
            className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)"
            style={{ height: runwayH }}
          >
            {/* Sticky wrapper — pins below the navbar.
                 Height is the VISUAL scaled height so the layout footprint
                 matches what the user actually sees. The inner scale div
                 overflows below this boundary, but its overflow is empty
                 (no content there), so nothing is clipped visually. */}
            <div
              className="sticky"
              style={{
                top: NAVBAR_H,
                height: stickyContentH * stickyScale,
              }}
            >
              {/*
               * Scale wrapper: shrinks the entire title+cards block uniformly
               * so it always fits within the viewport, even when zoomed in.
               * transform-origin: top center keeps the heading aligned correctly.
               */}
              <div
                style={{
                  transform: `scale(${stickyScale})`,
                  transformOrigin: "top center",
                  /*
                   * When scaled down the block's layout height stays at the
                   * original value (CSS transforms don't affect flow), so we
                   * explicitly cap the visible area to avoid phantom whitespace.
                   */
                  height: stickyContentH,
                  maxHeight: stickyContentH,
                }}
              >
                {/* Section title */}
                <div
                  ref={titleRef}
                  className="flex flex-col items-center select-none"
                  style={{ marginBottom: TITLE_BOTTOM_MARGIN }}
                >
                  <SectionHeading id="projects-heading" />
                </div>

                {/* Card viewport — clipPath hides cards entering from below.
                    Negative insets let rotated corners bleed without clipping. */}
                <div
                  className="relative"
                  style={{
                    height: cardAreaH,
                    clipPath: "inset(-200px -200px -200px -200px)",
                  }}
                >
                  {PROJECTS.map((project, index) => (
                    <div
                      key={project.id}
                      ref={(el) => {
                        cardEls.current[index] = el;
                        if (index === 0) firstCardRef.current = el;
                      }}
                      className="absolute inset-x-0 flex justify-center will-change-transform"
                      style={{ zIndex: index + 1 }}
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
