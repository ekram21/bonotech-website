import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import f1CarLeft from '@/assets/introduction/f1-car-left.png'
import f1CarRight from '@/assets/introduction/f1-car-right.png'
import f1StripGradient from '@/assets/introduction/f1-strip-gradient.png'
import type { IntroductionSectionProps } from './IntroductionSection.types'
import { OutcomeIcon, SecurityIcon, SpeedIcon } from './icons'

const FEATURE_CARDS = [
    {
        icon: SpeedIcon,
        title: 'Speed',
        text: 'Faster product cycles.',
    },
    {
        icon: SecurityIcon,
        title: 'Security',
        text: 'Enterprise ready architecture and governance.',
    },
    {
        icon: OutcomeIcon,
        title: 'Outcome',
        text: 'Business metrics tied to every sprint.',
    },
] as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 110, damping: 18 },
    },
}

const carEase = [0.22, 1, 0.36, 1] as const

const carStripVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
}

const leftCarVariants = {
    hidden: { x: '-50vw', opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 1.2, ease: carEase },
    },
}

const rightCarVariants = {
    hidden: { x: '50vw', opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 1.2, ease: carEase },
    },
}

export function IntroductionSection({ className }: IntroductionSectionProps) {
    return (
        <section
            id="introduction"
            aria-labelledby="introduction-heading"
            className={cn('w-full bg-white', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) py-16 md:py-24">
                {/* Top row */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="flex min-h-[240px] flex-col justify-between rounded-[24px] bg-[#8269CF] p-8 md:min-h-[240px] md:p-10">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5">
                            <span
                                className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]"
                                aria-hidden="true"
                            />
                            <span className="font-body text-[12px] font-medium uppercase tracking-[0.05em] text-[#8269CF]">
                                Introducing Bonotech
                            </span>
                        </div>

                        <h2
                            id="introduction-heading"
                            className="mt-2 font-display text-[40px] font-semibold leading-[1.08] tracking-tight text-white sm:text-[48px] md:text-[56px] lg:mt-0"
                        >
                            Better. Faster.
                            <br />
                            Stronger.
                        </h2>
                    </div>

                    <div className="flex min-h-[240px] flex-col justify-center rounded-[24px] border border-[#E8E9EB] bg-[#F5F3FB] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:min-h-[240px] md:p-10">
                        <h3 className="font-display text-[28px] font-semibold leading-[1.2] text-[#272829] sm:text-[32px]">
                            Zero to Launch with{' '}
                            <span className="text-[#8269CF]">SPEED.</span>
                        </h3>
                        <p className="mt-4 font-body text-[16px] leading-[1.6] text-[#444547]">
                            Turn ideas into custom software and SaaS products in a shorter time frame,
                            with Bonotech AI-accelerated product engine. Designs intuitive and scalable
                            systems combining AI-native delivery, shorter product cycles, and measurable
                            business KPIs.
                        </p>
                    </div>
                </div>

                {/* Feature cards */}
                <motion.div
                    className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                >
                    {FEATURE_CARDS.map((card) => {
                        const Icon = card.icon

                        return (
                            <motion.article
                                key={card.title}
                                variants={cardVariants}
                                className="flex min-h-[200px] flex-col justify-between rounded-[24px] bg-[#F5F3FB] p-6 md:p-8"
                            >
                                <div
                                    className="flex h-[56px] w-[56px] items-center justify-center rounded-[12px] bg-[#FFFFFF]"
                                    aria-hidden="true"
                                >
                                    <Icon className="h-8 w-8" />
                                </div>

                                <div className="mt-8">
                                    <h4 className="font-display text-[28px] font-semibold leading-[1.2] text-[#272829] md:text-[32px]">
                                        {card.title}
                                    </h4>
                                    <p className="mt-2 font-body text-[16px] leading-[1.5] text-[#75777A]">
                                        {card.text}
                                    </p>
                                </div>
                            </motion.article>
                        )
                    })}
                </motion.div>
            </div>

            {/* F1 car strip — full-width lavender band, cars slide in from sides */}
            <motion.div
                className="relative mt-5 w-full overflow-x-clip"
                variants={carStripVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
            >
                <div className="relative pt-6 pb-[46px] sm:pt-8 md:pt-10">
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[46px] bg-[length:100%_100%] bg-no-repeat"
                        style={{ backgroundImage: `url(${f1StripGradient})` }}
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto flex w-full max-w-[100vw] items-end justify-between px-4 sm:px-8 md:px-12 lg:px-16">
                        <motion.div variants={leftCarVariants} className="will-change-transform">
                            <img
                                src={f1CarLeft}
                                alt=""
                                aria-hidden="true"
                                className="h-[48px] w-auto max-w-[40vw] object-contain object-left sm:h-[56px] md:h-[64px] lg:h-[72px]"
                                draggable={false}
                            />
                        </motion.div>
                        <motion.div variants={rightCarVariants} className="will-change-transform">
                            <img
                                src={f1CarRight}
                                alt=""
                                aria-hidden="true"
                                className="h-[48px] w-auto max-w-[40vw] object-contain object-right sm:h-[56px] md:h-[64px] lg:h-[72px]"
                                draggable={false}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
