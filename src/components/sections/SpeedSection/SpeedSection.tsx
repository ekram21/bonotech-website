import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import speedBg from '@/assets/speed/speed-bg.png'
import speedLightning from '@/assets/speed/speed-lightning.png'
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

const cardHoverVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.01,
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
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
                                return (
                                    <motion.li key={item.title} variants={itemVariants}>
                                        <motion.div
                                            className="group flex cursor-pointer flex-wrap items-center gap-3 overflow-hidden rounded-2xl border border-[#8269CF]/25 bg-[#8269CF]/10 px-4 py-4 backdrop-blur-sm sm:gap-4 sm:px-5"
                                            variants={cardHoverVariants}
                                            initial="rest"
                                            whileHover="hover"
                                            animate="rest"
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
        </section>
    )
}
