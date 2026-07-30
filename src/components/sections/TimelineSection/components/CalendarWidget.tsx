import { AnimatePresence, motion } from 'framer-motion'

const SCALE_MARKS = [3, 30, 60] as const
const SCALE_MAX = 60

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
            <div className="flex items-start gap-3">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={days}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-[96px] font-semibold leading-none tracking-[-0.04em] text-[#272829] sm:text-[112px]"
                    >
                        {days}
                    </motion.span>
                </AnimatePresence>

                <div className="flex flex-col items-start gap-2 pt-3 sm:pt-4">
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
                            className="inline-flex items-center gap-2 rounded-md bg-[#8269CF] px-3 py-1.5"
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
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
