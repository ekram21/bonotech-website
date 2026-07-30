import { useEffect, useState } from 'react'
import {
    AnimatePresence,
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
} from 'framer-motion'

const SCALE_MARKS = [3, 30, 60] as const
const SCALE_MAX = 60

function CountingNumber({ value }: { value: number }) {
    const motionValue = useMotionValue(value)
    const [display, setDisplay] = useState(value)

    useMotionValueEvent(motionValue, 'change', (latest) => {
        setDisplay(Math.round(latest))
    })

    useEffect(() => {
        const distance = Math.abs(value - motionValue.get())
        const duration = Math.min(1.4, Math.max(0.55, distance / 50))

        const controls = animate(motionValue, value, {
            duration,
            ease: [0.22, 1, 0.36, 1],
        })

        return () => controls.stop()
    }, [value, motionValue])

    return (
        <span className="font-display text-[96px] font-semibold leading-none tracking-[-0.04em] text-[#272829] sm:text-[112px] tabular-nums">
            {display}
        </span>
    )
}

export function CalendarWidget({
    days,
    badge,
}: {
    days: number
    badge: string
}) {
    const fillPercent = Math.min(100, Math.max((days / SCALE_MAX) * 100, 4))

    return (
        <div className="w-full max-w-[440px]">
            <div className="flex items-end gap-5">
                <CountingNumber value={days} />

                <div className="flex flex-col items-start gap-2 pb-2 sm:pb-3 mb-3">
                    <span className="font-body text-[18px] font-medium leading-none text-[#272829] sm:text-[20px]">
                        Days
                    </span>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={badge}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-flex items-center gap-2 rounded-full bg-[#8269CF] px-3 py-1.5"
                        >
                            <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                                aria-hidden="true"
                            />
                            <span className="font-display text-[12px] font-semibold uppercase tracking-[0.06em] text-white">
                                {badge}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-6">
                <div
                    className="relative h-[3px] w-full overflow-hidden rounded-full bg-[#E8E9EB]"
                    role="presentation"
                >
                    <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-[#8269CF]"
                        initial={false}
                        animate={{ width: `${fillPercent}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>

                <div className="mt-2 flex justify-between">
                    {SCALE_MARKS.map((mark) => (
                        <span
                            key={mark}
                            className={
                                mark === days
                                    ? 'font-body text-[14px] font-semibold text-[#8269CF]'
                                    : 'font-body text-[14px] font-medium text-[#75777A]'
                            }
                        >
                            {mark}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
