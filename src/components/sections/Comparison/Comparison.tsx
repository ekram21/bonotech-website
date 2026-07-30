import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import bonotechLogo from '@/assets/bonotech-logo.png'
import type { ComparisonProps, TimelineStep } from './Comparison.types'

const TRADITIONAL_STEPS: TimelineStep[] = [
    {
        number: 1,
        title: 'Month 1-2',
        description: 'Discovery And Requirements',
    },
    {
        number: 2,
        title: 'Month 3',
        description: 'Product Scoping',
    },
    {
        number: 3,
        title: 'Month 4',
        description: 'UI UX Design',
    },
    {
        number: 4,
        title: 'Month 5-7',
        description: 'Development',
    },
    {
        number: 5,
        title: 'Month 8-10',
        description: 'QA, Revisions, Launch Prep And Launch',
    },
]

const BONOTECH_STEPS: TimelineStep[] = [
    {
        number: 1,
        title: 'Week 1',
        description: 'SME-Led Product Understanding & AI-Assisted Requirement Mapping',
    },
    {
        number: 2,
        title: 'Week 2',
        description: 'UX Prototype, Architecture, And Sprint Backlog',
    },
    {
        number: 3,
        title: 'Week 3-6',
        description: 'AI-Assisted Development And Rapid Iteration',
    },
    {
        number: 4,
        title: 'Week 7-8',
        description: 'QA, Hardening, Deployment, Analytics, And Launch Readiness',
    },
]

function DurationBlock({
    label,
    value,
    accent = '#272829',
}: {
    label: string
    value: number
    accent?: string
}) {
    return (
        <div className="flex shrink-0 flex-col items-start gap-2">
            <span
                className="text-left font-display text-[18px] font-semibold leading-none tracking-[-0.005em]"
                style={{ color: accent }}
            >
                {label}
            </span>
            <div
                className="h-[6px] w-[120px] overflow-hidden rounded-full"
                style={{ backgroundColor: `${accent}33` }}
                role="presentation"
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accent }}
                    initial={{ width: '0%' }}
                    animate={{ width: [`0%`, `${value}%`] }}
                    transition={{
                        duration: 1.1,
                        ease: [0.22, 1, 0.36, 1],
                        repeat: Infinity,
                        repeatDelay: 0.5,
                    }}
                />
            </div>
        </div>
    )
}

function TimelineList({
    steps,
    variant,
}: {
    steps: TimelineStep[]
    variant: 'light' | 'purple'
}) {
    const isPurple = variant === 'purple'

    return (
        <div className="flex flex-col">
            {steps.map((step, index) => (
                <div key={step.number} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                        <div
                            className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold shrink-0',
                                isPurple
                                    ? 'bg-white text-[#8269CF]'
                                    : 'bg-[#F4F5F6] text-[#272829]',
                            )}
                        >
                            {step.number}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    'my-2 min-h-[24px] w-0 flex-grow border-l-2 border-dashed',
                                    isPurple ? 'border-white/40' : 'border-[#B4B6B8]',
                                )}
                            />
                        )}
                    </div>

                    <div
                        className={cn(
                            'flex flex-col justify-start pt-1.5',
                            index === steps.length - 1 ? 'pb-0' : 'pb-6',
                        )}
                    >
                        <h4
                            className={cn(
                                'text-[16px] font-bold leading-[1.3]',
                                isPurple ? 'text-white' : 'text-[#272829]',
                            )}
                        >
                            {step.title}
                        </h4>
                        <p
                            className={cn(
                                'mt-1 font-body text-[12px] font-normal leading-[150%] tracking-[0]',
                                isPurple ? 'text-white' : 'text-[#444547]',
                            )}
                        >
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function Comparison({ className }: ComparisonProps) {
    return (
        <section
            id="comparison"
            aria-labelledby="comparison-heading"
            className={cn('w-full bg-white py-16 md:py-28', className)}
        >
            <div className="mx-auto flex w-full max-w-(--width-container) flex-col items-center px-(--spacing-container-x)">
                <div className="mb-4 flex items-center gap-2 rounded-full border border-[#E8E9EB] bg-white px-4 py-1.5 shadow-xs">
                    <div
                        className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]"
                        aria-hidden="true"
                    />
                    <span className="font-display text-[12px] font-medium uppercase leading-[140%] tracking-[0.05em] text-[#8269CF]">
                        What we do better
                    </span>
                </div>

                <h2
                    id="comparison-heading"
                    className="mb-12 max-w-[700px] text-center font-display text-[32px] font-semibold leading-[1.15] text-[#272829] md:mb-16 md:text-[48px]"
                >
                    From Slow Vendor Cycle to Marketable Products
                </h2>

                <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                    {/* Traditional Product Cycle */}
                    <div className="flex flex-col rounded-[24px] bg-[#F5F3FB] p-6 md:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-display text-[22px] font-semibold leading-tight text-[#272829] sm:text-[24px]">
                                    Traditional Product Cycle
                                </h3>
                                <p className="mt-1 font-body text-[16px] font-normal leading-[1.5] tracking-[-0.25px] text-content-tertiary">
                                    Slow And Linear
                                </p>
                            </div>
                            <DurationBlock label="10 Month" value={82} />
                        </div>

                        <div className="flex-1 rounded-[16px] bg-white p-6 md:p-8">
                            <TimelineList steps={TRADITIONAL_STEPS} variant="light" />
                        </div>
                    </div>

                    {/* BONOTECH */}
                    <div className="flex flex-col rounded-[24px] bg-[#F5F3FB] p-6 md:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <img
                                    src={bonotechLogo}
                                    alt="Bonotech"
                                    className="h-8 w-auto object-contain object-left sm:h-9"
                                    draggable={false}
                                />
                                <p className="mt-1 font-body text-[16px] font-normal leading-[1.5] tracking-[-0.25px] text-content-tertiary">
                                    Agile And AI-Accelerated
                                </p>
                            </div>
                            <DurationBlock label="2 Weeks" value={90} accent="#8269CF" />
                        </div>

                        <div className="relative flex-1 overflow-hidden rounded-[16px] bg-[#8269CF] p-6 md:p-8">
                            <div
                                className="pointer-events-none absolute bottom-0 right-0 h-[220px] w-[220px] translate-x-1/4 translate-y-1/4 rounded-full bg-white/[0.08]"
                                aria-hidden="true"
                            />
                            <div className="relative z-10">
                                <TimelineList steps={BONOTECH_STEPS} variant="purple" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
