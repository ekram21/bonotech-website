import { AnimatePresence, motion } from 'framer-motion'

const RING_COUNT = 15
const GRID_COLS = 7
const GRID_ROWS = 5

function SpiralRings() {
    return (
        <div
            className="relative z-10 flex justify-center gap-[5px] px-10"
            aria-hidden="true"
        >
            {Array.from({ length: RING_COUNT }).map((_, index) => (
                <div
                    key={index}
                    className="h-[26px] w-[11px] rounded-full bg-gradient-to-b from-[#FFC98A] via-[#FFAB50] to-[#F5923A] shadow-[0_1px_2px_rgba(245,146,58,0.35)]"
                />
            ))}
        </div>
    )
}

function CalendarGrid() {
    return (
        <div className="grid h-full w-full grid-cols-7 grid-rows-5">
            {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, index) => (
                <div
                    key={index}
                    className="border border-[#ECEEF3] bg-[#F8F9FC]"
                />
            ))}
        </div>
    )
}

export function CalendarWidget({ daysLabel }: { daysLabel: string }) {
    return (
        <div className="w-full max-w-[440px]">
            <SpiralRings />

            <div className="-mt-3 overflow-hidden rounded-[24px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                <div className="border-b-2 border-[#3B82F6] bg-[#8269CF] px-6 py-[14px] text-center">
                    <span className="font-display text-[20px] font-medium text-white">Timeline</span>
                </div>

                <div className="relative aspect-[7/5] min-h-[240px] bg-[#F8F9FC] sm:min-h-[280px]">
                    <CalendarGrid />

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={daysLabel}
                                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="font-display text-[44px] font-semibold leading-none text-[#8269CF] sm:text-[52px]"
                            >
                                {daysLabel}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
