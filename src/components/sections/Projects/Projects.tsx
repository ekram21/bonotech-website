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
import getMyGrailIcon from "@/assets/projects/get-my-grail-icon.png";
import getMyGrailLogo from "@/assets/projects/get-my-grail-logo.png";
import polysignalsMockup from "@/assets/projects/polysignals-mockup.png";
import polysignalsIcon from "@/assets/projects/polysignals-icon.png";
import polysignalsLogo from "@/assets/projects/polysignals-logo.png";
import edutechsMockup from "@/assets/projects/edutechs-mockup.png";
import edutechsIcon from "@/assets/projects/edutechs-icon.png";
import edutechsLogo from "@/assets/projects/edutechs-logo.png";

const PROJECTS: ProjectCardData[] = [
  {
    id: "gustav",
    category: "Travel & Tourism",
    title: "Gustav, Hotel Companion Mobile App",
    features: [
      "Guest Experience",
      "Mobile Ordering",
      "Concierge workflow",
      "Hospitality Operation",
      "Service Request",
      "Staff Communication",
      "Customer facing Mobile Journey",
    ],
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
    features: [
      "Tenant Workflow",
      "Property Operation",
      "Maintenance Tracking",
      "Rent Collection",
      "Owner Dashboard",
      "Real State Automation",
      "Multi Stakeholder Communication",
    ],
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
    id: "get-my-grail",
    category: "MMS",
    title: "Where collectors Can buy their Collectibles",
    features: [
      "Marketplace Flow",
      "Inventory Like system",
      "User accounts",
      "Listings",
      "Buyer seller workflow",
      "Digital Commerce",
      "Community Driven Platforms",
    ],
    backgroundColor: "#D8D8D8",
    borderColor: "#D4D4D4",
    buttonColor: "#333333",
    mockupSrc: milioMockup,
    iconSrc: getMyGrailIcon,
    iconCover: true,
    logoSrc: getMyGrailLogo,
    logoAlt: "Get My Grail logo",
    logoWidth: 170,
    logoHeight: 79,
    playStoreHref: "#",
    appStoreHref: "#",
    learnMoreHref: "#",
    opacity: 35,
  },
  {
    id: "polysignals",
    category: "Prediction",
    title: "Build a Track Record People Can Trust.",
    features: [
      "Blockchain Verification",
      "On chain Record",
      "Reputation System",
      "Financial Data Workflow",
      "Public Accountability Systems",
      "Market Facing Mobile Products",
      "Complex Scoring and Ranking System",
    ],
    backgroundColor: "#EDF8F1",
    borderColor: "#DAF1E2",
    buttonColor: "#3D8B5F",
    mockupSrc: polysignalsMockup,
    iconSrc: polysignalsIcon,
    logoSrc: polysignalsLogo,
    logoAlt: "Polysignals logo",
    logoWidth: 300,
    logoHeight: 40,
    playStoreHref:
      "https://play.google.com/store/apps/details?id=app.zenythlabs.polysignals",
    appStoreHref: "https://apps.apple.com/ua/app/polysignals/id6758582770",
    learnMoreHref: "#",
    opacity: 90,
  },
  {
    id: "edutechs",
    category: "LMS",
    title: "Edutechs, Learning Management Mobile App",
    features: [
      "Student Information System",
      "Learning Management",
      "Attendance Tracking",
      "Payments",
      "Teacher Tools",
      "School Administration",
      "Education Workflow Automation",
    ],
    bulletColor: "#2B7FD4",
    backgroundColor: "#E6F6FF",
    borderColor: "#CCEDFF",
    buttonColor: "#2B7FD4",
    mockupSrc: edutechsMockup,
    iconSrc: edutechsIcon,
    logoSrc: edutechsLogo,
    logoAlt: "Edutechs logo",
    logoWidth: 274,
    logoHeight: 64,
    playStoreHref:
      "https://play.google.com/store/apps/details?id=com.ekram21112.edutechsstudentapp2024",
    appStoreHref: "https://apps.apple.com/ua/app/edutechs/id6602895268",
    learnMoreHref: "#",
    opacity: 90,
  },
];

/** Fixed height of the site navbar (px) */
const NAVBAR_H = 80;
/** Gap between navbar and first card when stacking begins (px) */
const CARD_STACK_TOP_GAP = 10;
/** Sticky pin point for the card stack (px from viewport top) */
const CARD_PIN_TOP = NAVBAR_H + CARD_STACK_TOP_GAP;
/** Degrees to rotate stacked cards (alternates ±) */
const CARD_ROTATION = 3;
/**
 * Minimum viewport width (px) to use the scroll-driven stacking layout.
 * Below this we fall back to the simple mobile stack.
 */
const DESKTOP_BREAKPOINT = 768;

/* Shared section heading */
const SectionHeading = ({ id }: { id?: string }) => (
  <div className="flex flex-col items-center text-center px-4 max-w-[800px] mx-auto">
    {/* Pill Badge */}
    <div className="flex items-center gap-2 mb-4 py-1.5 px-4 rounded-full bg-white border border-[#E8E9EB] shadow-xs">
      <div
        className="w-2 h-2 rounded-full shrink-0 bg-[#8269CF]"
        aria-hidden="true"
      />
      <span className="font-display font-medium text-[12px] leading-[140%] uppercase tracking-[0.05em] text-[#8269CF]">
        PROJECTS
      </span>
    </div>

    {/* Title */}
    <h2
      id={id}
      className="font-display font-semibold text-[32px] md:text-[48px] leading-[1.15] text-[#272829]"
    >
      Bono-Fide Products,<br className="hidden sm:inline" /> Built for Good.
    </h2>

    {/* Subtitle */}
    <p className="mt-4 font-body text-[16px] leading-[1.6] text-[#75777A] mb-20">
      Bonotech is focus on reinventing how industries operate has helped shape innovative technology across education, real estate, marketplaces, hospitality, and verification systems.
    </p>
  </div>
);

export function Projects({ className }: ProjectsProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
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

  const { cardH, viewportH } = dims;

  /* Visible height of the card-stacking viewport */
  const cardAreaH = cardH;

  /* Scroll distance allocated per card entering the stack (unscaled) */
  const scrollPerCard = isDesktop
    ? Math.max(cardH * 1.5, 600)
    : Math.max(cardH * 0.5, 300);

  /* Height of what the sticky wrapper "displays" (before scaling) */
  const stickyContentH = cardAreaH;

  /*
   * Scale the card stack down so it fits within the visible viewport
   * below the pin point, regardless of zoom level or screen size.
   */
  const availableH = Math.max(viewportH - CARD_PIN_TOP - 48, 320);
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

      /* progress = how many px the runway has scrolled past the card pin point */
      const progress = Math.max(0, CARD_PIN_TOP - rect.top);

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

        const entryY = cardAreaH + 250; // start just beyond the -200px clip extension so card is hidden at rest
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


  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className={cn(
        "relative w-full bg-[#F7F7F8] pt-28 lg:pb-28 pb-0",
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
          <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
            {/* Title scrolls away naturally before stacking begins */}
            <div className="flex flex-col items-center select-none">
              <SectionHeading id="projects-heading" />
            </div>

            {/* Scroll runway — oversized so the sticky wrapper stays pinned
                for the full card-animation duration */}
            <div
              ref={runwayRef}
              className="relative"
              style={{ height: runwayH }}
            >
              {/* Sticky wrapper — pins when the first card reaches CARD_PIN_TOP.
                   Height is the VISUAL scaled height so the layout footprint
                   matches what the user actually sees. */}
              <div
                className="sticky"
                style={{
                  top: CARD_PIN_TOP,
                  height: stickyContentH * stickyScale,
                }}
              >
                {/*
                 * Scale wrapper: shrinks the card stack uniformly so it
                 * always fits within the viewport below the pin point.
                 */}
                <div
                  style={{
                    transform: `scale(${stickyScale})`,
                    transformOrigin: "top center",
                    height: stickyContentH,
                    maxHeight: stickyContentH,
                  }}
                >
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
          </div>
        </>
      )}
    </section>
  );
}
