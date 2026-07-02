import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import speedBg from '@/assets/speed/speed-bg.png'
import {
    DeployableIcon,
    EvolvedIcon,
    ExpertLedIcon,
    ProductFocusedIcon,
    SwiftIcon,
} from './icons'
import type { SpeedSectionProps } from './SpeedSection.types'

const FEATURE_ITEMS = [
    {
        title: 'Swift',
        tag: 'Rapid MVPs',
        icon: SwiftIcon,
    },
    {
        title: 'Product Focused',
        tag: 'Real user Outcome focused',
        icon: ProductFocusedIcon,
    },
    {
        title: 'Expert-Led',
        tag: 'Guided, structured, and driven by experts',
        icon: ExpertLedIcon,
    },
    {
        title: 'Evolved',
        tag: 'AI-accelerated and always evolving',
        icon: EvolvedIcon,
    },
    {
        title: 'Deployable',
        tag: 'Shorter product cycles',
        icon: DeployableIcon,
    },
] as const

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

export function SpeedSection({ className }: SpeedSectionProps) {
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
            />

            <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                <div className="grid grid-cols-1 items-center lg:grid-cols-2">
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
                                return (
                                    <motion.li key={item.title} variants={itemVariants}>
                                        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#8269CF]/25 bg-[#8269CF]/10 px-4 py-4 backdrop-blur-sm sm:gap-4 sm:px-5">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white">
                                                <Icon className="h-6 w-6" />
                                            </div>

                                            <span className="min-w-[120px] flex-1 font-display text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
                                                {item.title}
                                            </span>

                                            <span className="rounded-full bg-[#8269CF] px-4 py-2 font-body text-[12px] leading-[1.35] text-white">
                                                {item.tag}
                                            </span>
                                        </div>
                                    </motion.li>
                                )
                            })}
                        </motion.ul>
                    </div>

                    <div className="hidden lg:block" aria-hidden="true" />
                </div>
            </div>
        </section>
    )
}
