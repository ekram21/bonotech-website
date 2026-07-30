import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import speedBg from '@/assets/speed/speed-bg.png'
import speedLightning from '@/assets/speed/speed-lightning.png'
import speedWireframeSketch from '@/assets/speed/speed-wireframe-sketch.png'
import speedAnalytics from '@/assets/speed/speed-analytics.png'
import speedExpertLed from '@/assets/speed/speed-expert-led-team.png'
import speedEvolved from '@/assets/speed/speed-evolved-brain.png'
import speedDeployable from '@/assets/speed/speed-deployable.png'
import {
    DeployableIcon,
    EvolvedIcon,
    ExpertLedIcon,
    ProductFocusedIcon,
    SwiftIcon,
} from './icons'
import { SpeedFeatureModal } from './components/SpeedFeatureModal'
import type { SpeedFeatureItem, SpeedSectionProps } from './SpeedSection.types'

const FEATURE_ITEMS: SpeedFeatureItem[] = [
    {
        id: 'swift',
        title: 'Swift',
        tag: 'Rapid MVPs',
        icon: SwiftIcon,
        modal: {
            title: 'Launch Rapid MVPs Faster With AI Assisted Product Delivery Systems',
            description:
                'Move from idea to working prototype quickly using focused sprints, reusable components, and intelligent delivery workflows.',
            imageSrc: speedWireframeSketch,
            imageAlt: 'Hand sketching mobile app wireframes on paper',
        },
    },
    {
        id: 'product-focused',
        title: 'Product Focused',
        tag: 'Real user Outcome focused',
        icon: ProductFocusedIcon,
        modal: {
            title: 'Build Every Feature Around Real Users And Measurable Product Outcomes',
            description:
                'Prioritize the right workflows by validating needs, reducing waste, and aligning design with business goals clearly.',
            imageSrc: speedAnalytics,
            imageAlt: 'Analytics dashboard showing user engagement and performance metrics',
        },
    },
    {
        id: 'expert-led',
        title: 'Expert-Led',
        tag: 'Guided, structured, and driven by experts',
        icon: ExpertLedIcon,
        modal: {
            title: 'Work With Senior Experts Who Guide Strategy Design And Delivery',
            description:
                'Experienced specialists guide decisions, unblock teams, and keep every sprint structured, practical, measurable, and consistently accountable.',
            imageSrc: speedExpertLed,
            imageAlt: 'Team collaborating in a modern office with a sprint planning whiteboard',
        },
    },
    {
        id: 'evolved',
        title: 'Evolved',
        tag: 'AI-accelerated and always evolving',
        icon: EvolvedIcon,
        modal: {
            title: 'Continuously Improve Products With AI Accelerated Learning And Scalable Systems',
            description:
                'Adapt faster with automated insights, modern architecture, and product systems designed to evolve beyond launch successfully.',
            imageSrc: speedEvolved,
            imageAlt: 'Metallic brain on a glowing circuit board representing AI evolution',
        },
    },
    {
        id: 'deployable',
        title: 'Deployable',
        tag: 'Shorter product cycles',
        icon: DeployableIcon,
        modal: {
            title: 'Ship Shorter Product Cycles With Production Ready Release Confidence Faster',
            description:
                'Release stable versions confidently through tested builds, clean handoff, deployment planning, and reliable launch support processes.',
            imageSrc: speedDeployable,
            imageAlt: 'Laptop screen showing production-ready application code',
        },
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
    },
}

const cardHoverVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.01,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
    },
}

export function SpeedSection({ className }: SpeedSectionProps) {
    const [activeModalId, setActiveModalId] = useState<string | null>(null)
    const activeFeature = FEATURE_ITEMS.find((item) => item.id === activeModalId)

    return (
        <section
            id="speed"
            aria-labelledby="speed-heading"
            className={cn('relative w-full overflow-hidden bg-black py-20 md:py-28', className)}
        >
            <img
                src={speedBg}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                draggable={false}
            />

            <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-8">
                    <div className="max-w-[640px]">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#8269CF]/40 bg-[#8269CF]/20 px-4 py-1.5">
                            <div className="h-2 w-2 shrink-0 rounded-full bg-[#C4B5FD]" aria-hidden="true" />
                            <span className="font-display text-[11px] font-medium uppercase tracking-[0.06em] text-[#DDD6FE] sm:text-[12px]">
                                Speed — The #1 SME Product Engine
                            </span>
                        </div>

                        <h2
                            id="speed-heading"
                            className="mt-5 font-display text-[40px] font-semibold leading-[1.1] text-white sm:text-[48px] md:text-[56px]"
                        >
                            Meet SPEED
                        </h2>

                        <p className="mt-4 max-w-[560px] font-body text-[16px] leading-[1.65] text-[#C9C9CC] md:text-[17px]">
                            Bonotech&apos;s cross-industry team turns product needs into smarter
                            workflows &amp; faster delivery AI-accelerated, but expert-led.
                        </p>

                        <motion.ul
                            className="mt-10 flex flex-col gap-3"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            {FEATURE_ITEMS.map((item) => {
                                const Icon = item.icon
                                const hasModal = Boolean(item.modal)

                                return (
                                    <motion.li key={item.id} variants={itemVariants}>
                                        <motion.div
                                            className="group flex cursor-pointer flex-wrap items-center gap-3 overflow-hidden rounded-2xl border border-[#8269CF]/25 bg-[#8269CF]/10 px-4 py-4 backdrop-blur-sm sm:gap-4 sm:px-5"
                                            variants={cardHoverVariants}
                                            initial="rest"
                                            whileHover="hover"
                                            animate="rest"
                                            role={hasModal ? 'button' : undefined}
                                            tabIndex={hasModal ? 0 : undefined}
                                            onClick={
                                                hasModal
                                                    ? () => setActiveModalId(item.id)
                                                    : undefined
                                            }
                                            onKeyDown={
                                                hasModal
                                                    ? (event) => {
                                                          if (
                                                              event.key === 'Enter' ||
                                                              event.key === ' '
                                                          ) {
                                                              event.preventDefault()
                                                              setActiveModalId(item.id)
                                                          }
                                                      }
                                                    : undefined
                                            }
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white">
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <span className="min-w-[120px] flex-1 font-display text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
                                                {item.title}
                                            </span>

                                            <span className="inline-flex max-w-0 translate-x-2 overflow-hidden whitespace-nowrap rounded-full bg-[#8269CF] py-2 pl-0 pr-0 font-body text-[12px] leading-[1.35] text-white opacity-0 transition-all duration-300 ease-out group-hover:max-w-xs group-hover:translate-x-0 group-hover:pl-4 group-hover:pr-4 group-hover:opacity-100 sm:group-hover:max-w-sm">
                                                {item.tag}
                                            </span>
                                        </motion.div>
                                    </motion.li>
                                )
                            })}
                        </motion.ul>
                    </div>

                    <div className="relative flex h-full min-h-[280px] items-center justify-center lg:min-h-0 lg:justify-end">
                        <img
                            src={speedLightning}
                            alt=""
                            aria-hidden="true"
                            className="h-full w-auto max-w-full object-contain"
                            draggable={false}
                        />
                    </div>
                </div>
            </div>

            {activeFeature?.modal && (
                <SpeedFeatureModal
                    open={activeModalId === activeFeature.id}
                    onClose={() => setActiveModalId(null)}
                    icon={activeFeature.icon}
                    title={activeFeature.modal.title}
                    description={activeFeature.modal.description}
                    imageSrc={activeFeature.modal.imageSrc}
                    imageAlt={activeFeature.modal.imageAlt}
                />
            )}
        </section>
    )
}
