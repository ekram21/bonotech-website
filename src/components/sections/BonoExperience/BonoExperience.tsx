import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { BonoExperienceProps, ExperienceCardData } from "./BonoExperience.types"

const ROW1_CARDS: ExperienceCardData[] = [
  {
    title: "SME Fusion Discovery",
    description: "Subject matter experts, product consultants, technical architects, and AI planning layer align the opportunity",
    bullets: [
      "Subject matter expert",
      "Product consultant",
      "Technical architect",
      "AI planning layer",
    ],
  },
  {
    title: "AI Blueprinting",
    description: "Product goals are transformed into user journeys, architecture, risks, and sprint backlog",
    bullets: [
      "Business goals",
      "User journeys",
      "Architecture",
      "Sprint backlog",
    ],
    isHighlighted: true,
  },
  {
    title: "Rapid Prototype Validation",
    description: "Interactive prototypes help stakeholders validate user flows and approve direction faster",
    bullets: [
      "Interactive prototype",
      "Stakeholder reviews",
      "User-flow validation",
      "Executive signoff",
    ],
  },
]

const ROW2_CARDS: ExperienceCardData[] = [
  {
    title: "Bono Fit Governance",
    description: "Every sprint stays accountable through checkpoints, dashboards, shared backlog, and reviews",
    bullets: [
      "Executive checkpoint",
      "Sprint review",
      "Shared backlog",
      "KPI dashboard",
    ],
  },
  {
    title: "AI Assistant Engineering",
    description: "Engineering gets faster with code generation, testing, documentation, refactoring, and QA automation",
    bullets: [
      "Code generation",
      "Test generation",
      "API integration",
      "QA automation",
    ],
  },
]

export function BonoExperience({ className }: BonoExperienceProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 16,
      },
    },
  }

  const renderCard = (card: ExperienceCardData) => {
    return (
      <motion.div
        key={card.title}
        variants={cardVariants}
        className="group relative overflow-hidden bg-[#F4F5F6] border border-[#E8E9EB]/60 rounded-[24px] p-6 flex flex-col justify-between hover:bg-[#8269CF] hover:border-[#8269CF]/10 transition-all duration-300 ease-in-out cursor-pointer"
      >
        {/* Subtle background glow effect appearing on hover */}
        <div
          className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full bg-white/[0.06] translate-x-1/4 translate-y-1/4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
        
        <div>
          <h3 className="font-display font-semibold text-[24px] leading-[1.2] text-[#313233] group-hover:text-white transition-colors duration-300">
            {card.title}
          </h3>
          <p className="mt-3 font-body text-[16px] leading-[1.6] text-[#75777A] group-hover:text-white/85 transition-colors duration-300">
            {card.description}
          </p>
        </div>
        
        <ul className="mt-8 flex flex-col gap-2 relative z-10">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2 font-body text-[14px] leading-[1.4] text-[#313233] group-hover:text-white transition-colors duration-300">
              <span className="w-2 h-2 rounded-full bg-[#8269CF] group-hover:bg-white shrink-0 transition-colors duration-300" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    )
  }

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={cn("w-full bg-white py-16 md:py-28 overflow-hidden", className)}
    >
      <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
        {/* Header Block */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto mb-16 px-4 select-none">
          {/* Centered Pill Badge */}
          <div className="flex items-center gap-2 mb-4 py-1.5 px-4 rounded-full bg-[#F4F0FA] border border-[#E8E9EB]/50 shadow-xs">
            <div
              className="w-2 h-2 rounded-full shrink-0 bg-[#8269CF]"
              aria-hidden="true"
            />
            <span className="font-display font-medium text-[12px] leading-[140%] uppercase tracking-[0.05em] text-[#8269CF]">
              EXPERIENCE
            </span>
          </div>

          {/* Section Title */}
          <h2
            id="experience-heading"
            className="font-display font-semibold text-[32px] md:text-[48px] leading-[1.15] text-[#313233]"
          >
            The Bono Experience
          </h2>

          {/* Section Subtitle */}
          <p className="mt-4 font-body text-[16px] leading-[1.6] text-[#75777A]">
            Bonotech uses AI to accelerate the entire product lifecycle from research to launch, building systems that evolve with <span className="font-bold text-[#313233]">SPEED</span> and accountability at every step
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {ROW1_CARDS.map((card) => renderCard(card))}
          </div>

          {/* Row 2: 2 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {ROW2_CARDS.map((card) => renderCard(card))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
