import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TestimonialsProps, TestimonialData } from "./Testimonials.types";

const TESTIMONIALS: TestimonialData[] = [
  {
    id: "testimonial-1",
    quote:
      "Gustav is a user-friendly, visually appealing all-in-one cloud PMS. Intuitive, time-saving, and reliable—with excellent reports and friendly support for effortless hotel management.",
    authorName: "MD. Shohiduzzaman Shakil",
    authorRole: "Generalist-Human Resources, Mermaid Beach Resort",
    backgroundColor: "#8269CF",
  },
  // {
  //   id: "testimonial-2",
  //   quote:
  //     "Created by my ex-students. They have made my classroom management much easier and have created all advanced custom features that I have asked for.",
  //   authorName: "Engr. Md. Nadim",
  //   authorRole: "Teacher, Edbase",
  //   backgroundColor: "#131314",
  // },
  // {
  //   id: "testimonial-3",
  //   quote:
  //     "Working with Bonotech was a game-changer for our business. They transformed our vision into a beautiful, functional application that our users love.",
  //   authorName: "James Wilson",
  //   authorRole: "Founder, BrightPath",
  //   backgroundColor: "#F59E0B",
  // },
];

/** Stack visual config — per-layer overrides for a natural deck look */
const STACK_LAYERS = [
  // layer 0 = front card (full size, no transform)
  { rotation: 0, scale: 1, yOffset: 0, xOffset: 0 },
  // layer 1 = first card behind (peeking out)
  { rotation: 1, scale: 0.92, yOffset: -60, xOffset: 0 },
  // layer 2 = second card behind (peeking out further)
  { rotation: -1, scale: 0.82, yOffset: -130, xOffset: 10 },
];
const STACK_TOP_OFFSET = 48; // px — desired space under title

function QuoteIcon() {
  return (
    <svg
      width="56"
      height="42"
      viewBox="0 0 56 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 42V25.2C0 20.72 0.77 16.52 2.31 12.6C3.92 8.68 6.58 4.76 10.29 0.84L18.9 5.88C16.38 8.82 14.56 11.62 13.44 14.28C12.39 16.87 11.76 19.6 11.55 22.47H22.68V42H0ZM33.32 42V25.2C33.32 20.72 34.09 16.52 35.63 12.6C37.24 8.68 39.9 4.76 43.61 0.84L52.22 5.88C49.7 8.82 47.88 11.62 46.76 14.28C45.71 16.87 45.08 19.6 44.87 22.47H56V42H33.32Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
    </svg>
  );
}

/**
 * Returns the text color for a given card background.
 * Dark backgrounds → white text, light backgrounds → dark text.
 */
function getTextColor(bg: string): { primary: string; secondary: string } {
  if (bg === "#131314") {
    return { primary: "#FFFFFF", secondary: "rgba(255,255,255,0.6)" };
  }
  if (bg === "#FFAB51") {
    return { primary: "#FFFFFF", secondary: "rgba(255,255,255,0.6)" };
  }
  // Default purple card
  return { primary: "#FFFFFF", secondary: "rgba(255,255,255,0.6)" };
}

const MOBILE_BREAKPOINT_PX = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
    setIsMobile(mq.matches);
    const listener = () => setIsMobile(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return isMobile;
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const colors = getTextColor(testimonial.backgroundColor);

  return (
    <div
      className="w-full max-w-300 md:min-h-99.25 rounded-3xl p-8 md:p-16 flex flex-col gap-5 md:gap-12"
      style={{
        backgroundColor: testimonial.backgroundColor,
        color: colors.primary,
      }}
    >
      {/* Quote icon */}
      <QuoteIcon />

      {/* Quote text */}
      <p className="font-body font-medium text-base md:font-semibold md:text-[28px] leading-snug md:leading-none tracking-[-0.005em]">
        {testimonial.quote}
      </p>

      {/* Author */}
      <div className="flex flex-col gap-1">
        <span
          className="font-body font-bold text-base md:text-xl leading-[1.4]"
          style={{ color: colors.primary }}
        >
          {testimonial.authorName}
        </span>
        <span
          className="font-body font-normal text-sm md:text-lg leading-[1.4]"
          style={{ color: colors.secondary }}
        >
          {testimonial.authorRole}
        </span>
      </div>
    </div>
  );
}

export function Testimonials({ className }: TestimonialsProps) {
  // cardOrder[0] = front/top card, cardOrder[1] = behind it, etc.
  const [cardOrder, setCardOrder] = useState<number[]>(
    TESTIMONIALS.map((_, i) => i),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const directionRef = useRef<"next" | "prev">("next");
  const hasCompletedRef = useRef(false);
  const isMobile = useIsMobile();

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    directionRef.current = "next";
    hasCompletedRef.current = false;
    setIsAnimating(true);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    directionRef.current = "prev";
    hasCompletedRef.current = false;
    setIsAnimating(true);
  }, [isAnimating]);

  /** Called once when the driving card's animation finishes. */
  const handleAnimationComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    setCardOrder((prev) => {
      if (directionRef.current === "next") {
        // Top card goes to bottom
        const [front, ...rest] = prev;
        return [...rest, front];
      } else {
        // Bottom card comes to top, exited front card goes to end
        const last = prev[prev.length - 1];
        const front = prev[0];
        const middle = prev.slice(1, prev.length - 1);
        return [last, ...middle, front];
      }
    });
    setIsAnimating(false);
  }, []);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className={cn("relative w-full bg-surface-neutral", className)}
    >
      <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center py-28">
        {/* Section Title */}
        <div className="relative flex flex-col items-center select-none">
          <h2
            id="testimonials-heading"
            className="font-body font-semibold text-center text-[clamp(64px,10vw,128px)] leading-[1.15] tracking-normal bg-[linear-gradient(0deg,rgba(130,105,207,0.3)_0%,rgba(60,0,245,0.6)_100%)] bg-clip-text text-transparent"
          >
            Testimonials
          </h2>
        </div>

        {/* ─── Stacked Cards ─── */}
        <div
          className="relative w-full flex justify-center h-85 md:h-109.25"
          style={{
            marginTop: `${STACK_TOP_OFFSET}px`,
          }}
        >
          {cardOrder.map((cardIndex, position) => {
            const direction = directionRef.current;
            const lastPos = cardOrder.length - 1;

            // Current resting layer
            const layerIndex = Math.min(position, STACK_LAYERS.length - 1);
            const layer = STACK_LAYERS[layerIndex];

            // Default target = current layer
            let targetProps = {
              rotate: layer.rotation,
              scale: layer.scale,
              y: layer.yOffset,
              x: layer.xOffset,
              opacity: 1,
            };
            let zIndex = cardOrder.length - position;

            /* ── Next: top fades out, others shift up ── */
            if (isAnimating && direction === "next") {
              if (position === 0) {
                // Front card fades away
                targetProps = {
                  rotate: 0,
                  scale: 0.85,
                  y: -30,
                  x: 0,
                  opacity: 0,
                };
              } else {
                // Shift up one layer
                const newIdx = Math.min(position - 1, STACK_LAYERS.length - 1);
                const nl = STACK_LAYERS[newIdx];
                targetProps = {
                  rotate: nl.rotation,
                  scale: nl.scale,
                  y: nl.yOffset,
                  x: nl.xOffset,
                  opacity: 1,
                };
              }
            }

            /* ── Prev: front card exits right and fades, back card rises ── */
            if (isAnimating && direction === "prev") {
              if (position === 0) {
                // Front card exits right and fades (mirrors "next" exit)
                targetProps = {
                  rotate: 0,
                  scale: 0.85,
                  y: -30,
                  x: 150,
                  opacity: 0,
                };
                zIndex = cardOrder.length + 1;
              } else if (position === lastPos) {
                // Bottom card rises to front
                const fl = STACK_LAYERS[0];
                targetProps = {
                  rotate: fl.rotation,
                  scale: fl.scale,
                  y: fl.yOffset,
                  x: fl.xOffset,
                  opacity: 1,
                };
                zIndex = cardOrder.length;
              } else {
                // Shift down one layer
                const newIdx = Math.min(position + 1, STACK_LAYERS.length - 1);
                const nl = STACK_LAYERS[newIdx];
                targetProps = {
                  rotate: nl.rotation,
                  scale: nl.scale,
                  y: nl.yOffset,
                  x: nl.xOffset,
                  opacity: 1,
                };
              }
            }

            // The card that drives the completion callback (exiting card in both directions)
            const isDriver =
              isAnimating &&
              ((direction === "next" && position === 0) ||
                (direction === "prev" && position === 0));

            const isFrontCard = position === 0 && !isAnimating;
            const swipeThreshold = 50;
            const swipeVelocityThreshold = 300;

            return (
              <motion.div
                key={TESTIMONIALS[cardIndex].id}
                className="absolute flex justify-center w-full max-w-300 touch-pan-y"
                initial={false}
                style={{
                  zIndex,
                  transformOrigin: "bottom center",
                }}
                animate={targetProps}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
                drag={isMobile && isFrontCard ? "x" : false}
                dragConstraints={{
                  left: -120,
                  right: 120,
                }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (!isMobile || !isFrontCard || isAnimating) return;
                  const { offset, velocity } = info;
                  if (
                    offset.x > swipeThreshold ||
                    velocity.x > swipeVelocityThreshold
                  ) {
                    handlePrev();
                  } else if (
                    offset.x < -swipeThreshold ||
                    velocity.x < -swipeVelocityThreshold
                  ) {
                    handleNext();
                  }
                }}
                onAnimationComplete={
                  isDriver ? handleAnimationComplete : undefined
                }
              >
                <TestimonialCard testimonial={TESTIMONIALS[cardIndex]} />
              </motion.div>
            );
          })}
        </div>

        {/* ─── Navigation Arrows ─── */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Previous testimonial"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-border-primary bg-surface-neutral hover:bg-surface-primary transition-(--transition-base) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Next testimonial"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-border-primary bg-surface-neutral hover:bg-surface-primary transition-(--transition-base) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
