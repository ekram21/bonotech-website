import { motion } from 'framer-motion'
import type { StatusVariant } from './AiApproach.types'

const WIRE_COUNT = 6
const VIEW_WIDTH = 600
const VIEW_HEIGHT = 72

function getWirePaths(endY: number) {
    const endX = VIEW_WIDTH / 2
    const startXs = Array.from(
        { length: WIRE_COUNT },
        (_, i) => VIEW_WIDTH / 12 + i * (VIEW_WIDTH / 6),
    )

    return startXs.map(
        (startX) =>
            `M ${startX} 0 C ${startX} ${endY * 0.62}, ${endX} ${endY * 0.38}, ${endX} ${endY}`,
    )
}

function strokeForIndex(index: number, variant: 'mixed' | 'brand', statuses: StatusVariant[]) {
    if (variant === 'brand') return '#8269CF'
    return statuses[index] === 'success' ? '#22C55E' : '#E85D5D'
}

function AnimatedWire({
    d,
    color,
    delay,
}: {
    d: string
    color: string
    delay: number
}) {
    return (
        <motion.path
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 9"
            initial={{ opacity: 0, strokeDashoffset: 0 }}
            whileInView={{
                opacity: 0.9,
                strokeDashoffset: -52,
            }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
                opacity: { duration: 0.35, delay },
                strokeDashoffset: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: delay + 0.25,
                },
            }}
        />
    )
}

export function WiringConnectors({
    variant,
    statuses,
    stopShort = false,
}: {
    variant: 'mixed' | 'brand'
    statuses: StatusVariant[]
    stopShort?: boolean
}) {
    const endY = stopShort ? 54 : VIEW_HEIGHT
    const paths = getWirePaths(endY)
    const hubColor = variant === 'brand' ? '#8269CF' : '#E85D5D'

    return (
        <div className="relative mx-auto w-full max-w-[600px] px-1">
            <svg
                viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT + 6}`}
                className="h-[72px] w-full sm:h-[80px]"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
            >
                {paths.map((d, index) => (
                    <AnimatedWire
                        key={index}
                        d={d}
                        color={strokeForIndex(index, variant, statuses)}
                        delay={index * 0.1}
                    />
                ))}

                <motion.circle
                    cx={VIEW_WIDTH / 2}
                    cy={endY}
                    r={4}
                    fill={hubColor}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.85 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 18 }}
                />
            </svg>
        </div>
    )
}
