import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import experienceArt from '@/assets/bono-experience/experience-art.png'
import experienceBanner from '@/assets/bono-experience/experience-banner.png'
import type { BonoExperienceSectionProps, ExperienceCardData } from './BonoExperienceSection.types'
import { ExperienceCard } from './components/ExperienceCard'

const EXPERIENCE_CARDS: ExperienceCardData[] = [
    {
        title: 'SME Fusion Discovery',
        description:
            'Subject matter experts, product consultants, technical architects, and AI planning layer align the opportunity.',
        labels: [
            'Subject matter expert',
            'Product consultant',
            'Technical architect',
            'AI planning layer',
        ],
    },
    {
        title: 'AI Blueprinting',
        description:
            'Product goals are transformed into user journeys, architecture, risks, and sprint backlog',
        labels: ['Business goals', 'User journeys', 'Architecture', 'Sprint backlog'],
        isHighlighted: true,
    },
    {
        title: 'Rapid Prototype Validation',
        description:
            'Interactive prototypes help stakeholders validate user flows and approve direction faster.',
        labels: [
            'Interactive prototype',
            'Stakeholder reviews',
            'User-flow validation',
            'Executive signoff',
        ],
    },
    {
        title: 'Bono Fit Governance',
        description:
            'Every sprint stays accountable through checkpoints, dashboards, shared backlog, and reviews.',
        labels: ['Executive checkpoint', 'Sprint review', 'Shared backlog', 'KPI dashboard'],
    },
    {
        title: 'AI Assistant Engineering',
        description:
            'Engineering gets faster with code generation, testing, documentation, refactoring, and QA automation.',
        labels: ['Code generation', 'Test generation', 'API integration', 'QA automation'],
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

const artCardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 110, damping: 18 },
    },
}

export function BonoExperienceSection({ className }: BonoExperienceSectionProps) {
    const [row1Left, row1Center, row1Right, row2Left, row2Right] = EXPERIENCE_CARDS

    return (
        <section
            id="experience"
            aria-labelledby="experience-heading"
            className={cn('w-full overflow-hidden bg-white py-16 md:py-28', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                <div className="mx-auto mb-16 flex max-w-[800px] flex-col items-center px-4 text-center select-none">
                    <div className="mb-4 flex items-center gap-2 rounded-full border border-[#E8E9EB]/50 bg-[#F4F0FA] px-4 py-1.5 shadow-xs">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]" aria-hidden="true" />
                        <span className="font-display text-[12px] font-medium leading-[140%] tracking-[0.05em] text-[#8269CF] uppercase">
                            EXPERIENCE
                        </span>
                    </div>

                    <h2
                        id="experience-heading"
                        className="font-display text-[32px] font-semibold leading-[1.15] text-[#272829] md:text-[48px]"
                    >
                        The Bono-Experience
                    </h2>

                    <p className="mt-4 font-body text-[16px] font-normal leading-[1.5] tracking-[-0.25px] text-[#444547]">
                        Bonotech uses AI to accelerate the entire product lifecycle from research to launch,
                        building systems that evolve with{' '}
                        SPEED and accountability at every
                        step.
                    </p>
                </div>

                <motion.div
                    className="flex flex-col gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
                        <ExperienceCard card={row1Left} />
                        <ExperienceCard card={row1Center} />
                        <ExperienceCard card={row1Right} />
                    </div>

                    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
                        <ExperienceCard card={row2Left} />

                        <motion.article
                            variants={artCardVariants}
                            className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F5F6] p-6 lg:min-h-0"
                        >
                            <img
                                src={experienceArt}
                                alt=""
                                className="h-auto max-h-[280px] w-full max-w-[280px] object-contain"
                                loading="lazy"
                                draggable={false}
                            />
                        </motion.article>

                        <ExperienceCard card={row2Right} />
                    </div>
                </motion.div>

                <div className="ml-auto mt-10 w-full max-w-[817px] md:mt-12">
                    <img
                        src={experienceBanner}
                        alt=""
                        className="block h-[150px] w-full object-cover object-right"
                        loading="lazy"
                        draggable={false}
                    />
                </div>
            </div>
        </section>
    )
}
