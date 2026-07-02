import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import bonotechLogo from '@/assets/bonotech-logo.png'
import type { ComparisonProps, TimelineStep } from './Comparison.types'

const TRADITIONAL_STEPS: TimelineStep[] = [
    {
        number: 1,
        title: 'Month 1-2',
        description: 'Discovery and requirements',
    },
    {
        number: 2,
        title: 'Month 3',
        description: 'Product scoping',
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
        title: 'Month 1-2',
        description: 'Discovery and requirements',
    },
    {
        number: 6,
        title: 'Month 1-2',
        description: 'Discovery and requirements',
    },
    {
        number: 7,
        title: 'Month 8-10',
        description: 'QA, revisions, launch prep and launch',
    },
]

const BONOTECH_STEPS: TimelineStep[] = [
    {
        number: 1,
        title: 'Week 1',
        description: 'SME-led product understanding & AI-assisted requirement mapping',
    },
    {
        number: 2,
        title: 'Week 2',
        description: 'UX prototype, architecture, sprint backlog',
    },
    {
        number: 3,
        title: 'Week 3-6',
        description: 'AI-assisted development and rapid iteration',
    },
    {
        number: 4,
        title: 'Week 7-8',
        description: 'QA, hardening, deployment, analytics, and launch readiness',
    },
]

export function Comparison({ className }: ComparisonProps) {
    return (
        <section
            id="comparison"
            aria-labelledby="comparison-heading"
            className={cn('w-full bg-[#FFFFFF] py-16 md:py-28', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center">
                {/* Top Pill Badge */}
                <div className="flex items-center gap-2 mb-4 py-1.5 px-4 rounded-full bg-white border border-[#E8E9EB] shadow-xs">
                    <div
                        className="w-2 h-2 rounded-full shrink-0 bg-[#8269CF]"
                        aria-hidden="true"
                    />
                    <span className="font-display font-medium text-[12px] leading-[140%] uppercase tracking-[0.05em] text-[#8269CF]">
                        Comparison
                    </span>
                </div>

                {/* Section Heading */}
                <h2
                    id="comparison-heading"
                    className="max-w-[700px] font-display font-semibold text-[32px] md:text-[48px] leading-[1.15] text-center text-[#272829] mb-12 md:mb-16"
                >
                    From Slow Vendor Cycle to Marketable Products
                </h2>

                {/* Card Container */}
                <div className="w-full bg-white rounded-[24px] p-6 md:p-10 shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                        {/* Traditional Product Cycle (Left) */}
                        <div className="flex flex-col h-full">
                            {/* Column Header */}
                            <h3 className="text-[28px] font-semibold text-[#272829] text-center leading-tight">
                                Traditional Product Cycle
                            </h3>

                            {/* Timeframe Banner */}
                            <div className="flex items-center gap-3 w-full my-6 shrink-0">
                                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                                <div className="flex items-center gap-2 text-[#8269CF] text-[18px] font-[700] leading-none shrink-0 font-display">
                                    <Calendar className="w-[18px] h-[18px] text-[#8269CF] shrink-0" strokeWidth={2.2} />
                                    <span>10 Month</span>
                                </div>
                                <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                            </div>

                            {/* Timeline Box */}
                            <div className="flex-1 bg-[#F4F5F6] rounded-[16px] p-[24px] flex flex-col justify-start">
                                <div className="flex flex-col">
                                    {TRADITIONAL_STEPS.map((step, index) => (
                                        <div key={step.number} className="flex gap-4">
                                            {/* Left side: Circle and Line */}
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-white text-[16px] font-bold text-[#272829] shadow-xs shrink-0">
                                                    {step.number}
                                                </div>
                                                {index < TRADITIONAL_STEPS.length - 1 && (
                                                    <div className="w-[2px] flex-grow border-l-2 border-dashed border-[#B4B6B8] my-2 min-h-[24px]" />
                                                )}
                                            </div>
                                            {/* Right side: Text details */}
                                            <div className={cn("pt-1.5 flex flex-col justify-start", index === TRADITIONAL_STEPS.length - 1 ? "pb-0" : "pb-6")}>
                                                <h4 className="text-[16px] font-bold leading-[1.3] text-[#272829]">
                                                    {step.title}
                                                </h4>
                                                <p className="mt-1 text-[14px] font-normal leading-[1.4] text-[#272829]">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BONOTECH (Right) */}
                        <div className="flex flex-col h-full">
                            {/* Column Header */}
                            <div className="flex justify-center items-center h-[36px]">
                                <img
                                    src={bonotechLogo}
                                    alt="BONOTECH"
                                    className="h-[36px] w-auto object-contain"
                                />
                            </div>

                            {/* Timeframe Banner */}
                            <div className="flex items-center gap-3 w-full my-6 shrink-0">
                                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                                <div className="flex items-center gap-2 text-[#8269CF] text-[18px] font-[700] leading-none shrink-0 font-display">
                                    <Calendar className="w-[18px] h-[18px] text-[#8269CF] shrink-0" strokeWidth={2.2} />
                                    <span>2 Week</span>
                                </div>
                                <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                            </div>

                            {/* Timeline Box */}
                            <div className="flex-1 bg-[#8269CF] rounded-[16px] p-[24px] relative overflow-hidden flex flex-col justify-start">
                                {/* Decorative Faded Circle in Background */}
                                <div
                                    className="absolute bottom-0 right-0 w-[240px] h-[240px] rounded-full bg-white/[0.08] translate-x-1/4 translate-y-1/4 pointer-events-none"
                                    aria-hidden="true"
                                />

                                <div className="flex flex-col relative z-10">
                                    {BONOTECH_STEPS.map((step, index) => (
                                        <div key={step.number} className="flex gap-4">
                                            {/* Left side: Circle and Line */}
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-white text-[16px] font-bold text-[#8269CF] shadow-xs shrink-0">
                                                    {step.number}
                                                </div>
                                                {index < BONOTECH_STEPS.length - 1 && (
                                                    <div className="w-[2px] flex-grow border-l-2 border-dashed border-white/40 my-2 min-h-[24px]" />
                                                )}
                                            </div>
                                            {/* Right side: Text details */}
                                            <div className={cn("pt-1.5 flex flex-col justify-start", index === BONOTECH_STEPS.length - 1 ? "pb-0" : "pb-6")}>
                                                <h4 className="text-[16px] font-bold leading-[1.3] text-white">
                                                    {step.title}
                                                </h4>
                                                <p className="mt-1 text-[14px] font-normal leading-[1.4] text-white/95">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
