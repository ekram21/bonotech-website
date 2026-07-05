import { motion } from 'framer-motion'
import {
    BarChart3,
    Blocks,
    Check,
    ChevronDown,
    Gauge,
    Map,
    Search,
    Sparkles,
    Target,
    X,
    Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import bonotechPillLogo from '@/assets/ai-approach/bonotech-pill-logo.png'
import type { AiApproachProps, StatusVariant } from './AiApproach.types'
import {
    ContractIcon,
    DataIcon,
    EmailsIcon,
    ErpIcon,
    SheetsIcon,
    ToolsIcon,
} from './integration-icons'
import { WiringConnectors } from './WiringConnectors'
import { GenericAiChipIcon } from './pill-icons'

const INTEGRATIONS = [
    { label: 'Tools', icon: ToolsIcon },
    { label: 'Contract', icon: ContractIcon },
    { label: 'Sheets', icon: SheetsIcon },
    { label: 'ERP', icon: ErpIcon },
    { label: 'Data', icon: DataIcon },
    { label: 'Emails', icon: EmailsIcon },
] as const

const LEFT_STATUSES: StatusVariant[] = [
    'error',
    'error',
    'success',
    'error',
    'success',
    'error',
]

const PLUG_WORKFLOW = [
    { label: 'Misses exceptions', icon: Sparkles },
    { label: 'Low adoption', icon: Gauge },
    { label: 'No clear ROI', icon: Target },
] as const

const BONOTECH_WORKFLOW = [
    { label: 'Understand workflows', icon: Search },
    { label: 'Map Operational DNA', icon: Map },
    { label: 'Build Custom AI System', icon: Blocks },
    { label: 'Automate Supplier Work', icon: Zap },
    { label: 'Recover Margin', icon: BarChart3 },
] as const

const progressEase = [0.22, 1, 0.36, 1] as const

function StatusBadge({ variant }: { variant: StatusVariant }) {
    const styles: Record<StatusVariant, string> = {
        error: 'bg-[#E85D5D]',
        success: 'bg-[#22C55E]',
        brand: 'bg-[#8269CF]',
    }

    return (
        <div
            className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-white',
                styles[variant],
            )}
            aria-hidden="true"
        >
            {variant === 'error' ? <X size={11} strokeWidth={3} /> : <Check size={11} strokeWidth={3} />}
        </div>
    )
}

function IntegrationGrid({
    statuses,
    stopShort,
}: {
    statuses: StatusVariant[]
    stopShort?: boolean
}) {
    const variant = statuses[0] === 'brand' ? 'brand' : 'mixed'

    return (
        <div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-2">
                {INTEGRATIONS.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <div key={item.label} className="flex flex-col items-center gap-2">
                            <StatusBadge variant={statuses[index]} />
                            <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-[#F5F3FB] px-2 py-3">
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="text-center text-[11px] font-medium leading-tight text-[#75777A]">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            <WiringConnectors variant={variant} statuses={statuses} stopShort={stopShort} />
        </div>
    )
}

function CircularProgress({
    value,
    color,
    trackColor,
    size = 88,
}: {
    value: number
    color: string
    trackColor: string
    size?: number
}) {
    const stroke = 8
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(Math.max(value, 0), 100) / 100
    const arcLength = progress * circumference
    const gapLength = circumference - arcLength
    // Round caps extend into the gap; compensate when the gap is smaller than the stroke.
    const strokeDashoffset =
        progress >= 1
            ? 0
            : gapLength < stroke
              ? gapLength + stroke
              : gapLength

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={stroke}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{
                        strokeDashoffset,
                    }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.2, ease: progressEase, delay: 0.2 }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[22px] font-bold" style={{ color }}>
                    {value}%
                </span>
            </div>
        </div>
    )
}

function WorkflowSteps({
    items,
    statusVariant,
}: {
    items: readonly { label: string; icon: typeof Sparkles }[]
    statusVariant: 'error' | 'brand'
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            {items.map((item, index) => {
                const Icon = item.icon
                return (
                    <div key={item.label} className="flex w-full flex-col items-center gap-2">
                        <div className="flex w-full items-center gap-3 rounded-2xl border border-[#E8E9EB] bg-white px-4 py-3.5">
                            <div
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                                    statusVariant === 'error'
                                        ? 'bg-[#FFF0F0] text-[#E85D5D]'
                                        : 'bg-[#F4F0FA] text-[#8269CF]',
                                )}
                            >
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <span className="flex-1 text-left font-body text-[14px] font-medium text-[#272829] sm:text-[15px]">
                                {item.label}
                            </span>
                            <StatusBadge variant={statusVariant} />
                        </div>
                        {index < items.length - 1 && (
                            <ChevronDown
                                className="h-4 w-4 text-[#C4C6C8]"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function CoverageCard({
    value,
    progressColor,
    trackColor,
    className,
}: {
    value: number
    progressColor: string
    trackColor: string
    className?: string
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-5 rounded-[24px] px-5 py-5 sm:px-6 sm:py-6',
                className,
            )}
        >
            <CircularProgress
                value={value}
                color={progressColor}
                trackColor={trackColor}
            />
            <p className="text-left font-display text-[18px] font-semibold leading-[1.25] text-[#272829] sm:text-[20px]">
                Coverage of real workflow
            </p>
        </div>
    )
}

export function AiApproach({ className }: AiApproachProps) {
    const bonotechStatuses: StatusVariant[] = INTEGRATIONS.map(() => 'brand')

    return (
        <section
            id="ai-approach"
            aria-labelledby="ai-approach-heading"
            className={cn('w-full bg-white py-16 md:py-28', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
                    {/* Plug & Play AI */}
                    <div className="lg:border-r lg:border-[#E8E9EB] lg:pr-10 xl:pr-14">
                        <h2
                            id="ai-approach-heading"
                            className="text-center font-display text-[28px] font-semibold leading-[1.15] text-[#272829] sm:text-[32px]"
                        >
                            Plug &amp; Play AI
                        </h2>
                        <p className="mx-auto mt-3 max-w-[420px] text-center font-body text-[15px] leading-[1.6] text-[#75777A] sm:text-[16px]">
                            Hovers over your stack. It never connects the systems where the real
                            work lives.
                        </p>

                        <div className="mt-8">
                            <IntegrationGrid statuses={LEFT_STATUSES} stopShort />
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-2.5 rounded-full bg-[#F4F5F6] px-5 py-3 text-center">
                            <GenericAiChipIcon className="h-[22px] w-[22px] shrink-0" />
                            <span className="font-body text-[13px] text-[#444547] sm:text-[14px]">
                                <span className="font-semibold text-[#272829]">Generic AI</span>
                                <span className="font-normal"> Can&apos;t reach your real workflow</span>
                            </span>
                        </div>

                        <div className="mt-6">
                            <WorkflowSteps items={PLUG_WORKFLOW} statusVariant="error" />
                        </div>

                        <div className="mt-6">
                            <CoverageCard
                                value={22}
                                progressColor="#E85D5D"
                                trackColor="#F9D4D4"
                                className="bg-[#FFF5F5]"
                            />
                        </div>
                    </div>

                    {/* Bonotech approach */}
                    <div className="lg:pl-10 xl:pl-14">
                        <h2 className="text-center font-display text-[28px] font-semibold leading-[1.15] text-[#272829] sm:text-[32px]">
                            Bonotech approach
                        </h2>
                        <p className="mx-auto mt-3 max-w-[420px] text-center font-body text-[15px] leading-[1.6] text-[#75777A] sm:text-[16px]">
                            Plugs into every system and learns how they connect — then builds AI
                            that fits.
                        </p>

                        <div className="mt-8">
                            <IntegrationGrid statuses={bonotechStatuses} stopShort={false} />
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-2.5 rounded-full bg-[#8269CF] px-5 py-3 text-center">
                            <img
                                src={bonotechPillLogo}
                                alt="BONOTECH"
                                className="h-[22px] w-auto shrink-0 object-contain"
                                draggable={false}
                            />
                            <span className="font-display text-[13px] font-semibold tracking-[0.04em] text-white sm:text-[14px]">
                                Connects Every System
                            </span>
                        </div>

                        <div className="mt-6">
                            <WorkflowSteps items={BONOTECH_WORKFLOW} statusVariant="brand" />
                        </div>

                        <div className="mt-6">
                            <CoverageCard
                                value={98}
                                progressColor="#8269CF"
                                trackColor="#DDD5F0"
                                className="bg-[#F5F3FB]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
