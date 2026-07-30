import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import robotArt from '@/assets/robot-img.png'
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

const robotVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 110, damping: 18, delay: 0.1 },
    },
}

export function IntroductionSection({ className }: IntroductionSectionProps) {
    return (
        <section
            id="introduction"
            aria-labelledby="introduction-heading"
            className={cn('w-full overflow-hidden bg-white', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) pt-16 md:pt-24">
                <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,340px)_minmax(0,360px)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)_minmax(0,392px)] xl:gap-12">
                    <div className="order-1 self-end mb-8">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E8E9EB]/50 bg-[#F4F0FA] px-4 py-1.5">
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
                            className="mt-4 font-display text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#272829] sm:text-[48px] md:text-[56px]"
                        >
                            Better. Faster.
                            <br />
                            Stronger.
                        </h2>

                        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#F5F3FB] p-3">
                            <h3 className="font-display text-2xl font-bold leading-none tracking-[0] text-[#272829]">
                                Zero to Launch With <span className="text-[#8269CF]">SPEED.</span>
                            </h3>
                            <div className="flex flex-col gap-4">
                                <p className="font-body text-[16px] leading-[1.6] text-[#444547]">
                                    Turn ideas into custom software and SaaS products in a shorter time
                                    frame, with Bonotech AI-accelerated product engine.
                                </p>
                                <p className="font-body text-[16px] leading-[1.6] text-[#444547]">
                                    Designs intuitive and scalable systems combining AI-native delivery,
                                    shorter product cycles, and measurable business KPIs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        className="order-2 relative z-10 mx-auto flex w-full items-end justify-center"
                        variants={robotVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                    >
                        <img
                            src={robotArt}
                            alt="Bonotech robot mascot"
                            className="h-auto w-full max-w-[240px] -mb-[30px] object-contain object-bottom sm:max-w-[280px] md:max-w-[320px] md:-mb-[36px] lg:max-w-[360px] lg:-mb-[40px] xl:max-w-[400px]"
                            draggable={false}
                        />
                    </motion.div>

                    <motion.div
                        className="order-3 flex flex-col gap-4 self-end md:gap-5 mb-9"
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
                                    className="flex items-center gap-6 rounded-2xl bg-[#F5F3FB] p-5"
                                >
                                    <div
                                        className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[12px] bg-white"
                                        aria-hidden="true"
                                    >
                                        <Icon className="h-12 w-12" />
                                    </div>

                                    <div>
                                        <h4 className="font-display text-[22px] font-semibold leading-[1.2] text-[#272829] md:text-[24px]">
                                            {card.title}
                                        </h4>
                                        <p className="mt-1 font-body text-[14px] leading-[1.5] text-[#75777A] md:text-[15px]">
                                            {card.text}
                                        </p>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Blur strip — robot feet sit on this */}
            <div className="relative z-0 w-full overflow-x-clip" aria-hidden="true">
                <div
                    className="h-[46px] w-full bg-[length:100%_100%] bg-no-repeat"
                    style={{ backgroundImage: `url(${f1StripGradient})` }}
                />
            </div>
        </section>
    )
}
