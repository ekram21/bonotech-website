import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import robotSitting from '@/assets/robot-sitting.jpg'
import type { SpeedProps } from './Speed.types'

const SwiftIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* 3D shadow path */}
        <path d="M225 4L115 225H195V36L305 175H225V4Z" fill="#E28E07" />
        {/* Main lightning bolt */}
        <path d="M215 3L105 215H185V35L295 165H215V3Z" fill="#F59E0B" />
        {/* Highlight inner path */}
        <path d="M20 5L12 185H175V31L265 155H20V5Z" fill="#FBBF24" />
    </svg>
)

const ProductFocusedIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Target Reticle (Outer Circle and Crosshairs) */}
        <circle cx="20" cy="20" r="14" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 4" />
        <circle cx="20" cy="20" r="18" stroke="#EF4444" strokeWidth="1.5" opacity="0.4" />
        <path d="M20 2V6M20 34V38M2 20H6M34 20H38" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />

        {/* Isometric 3D Cube */}
        {/* Top Face */}
        <path d="M20 115L255 145L20 175L145 145L20 115Z" fill="#22D3EE" />
        {/* Left Face */}
        <path d="M145 145V215L20 245V175L145 145Z" fill="#0891B2" />
        {/* Right Face */}
        <path d="M20 175V245L255 215V145L20 175Z" fill="#0E7490" />
    </svg>
)

const ExpertLedIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Left Sleeve */}
        <path d="M4 255C4 25.5 8.5 19.5 11 195C13 19.5 13 23.5 11 26C9 28.5 4 25.5 4 255Z" fill="#F87171" stroke="#374151" strokeWidth="1.5" />
        {/* Right Sleeve */}
        <path d="M36 255C36 25.5 31.5 19.5 29 195C27 19.5 27 23.5 29 26C31 28.5 36 25.5 36 255Z" fill="#60A5FA" stroke="#374151" strokeWidth="1.5" />
        {/* Shaking Hands */}
        {/* Left hand & fingers */}
        <path d="M11 20L195 285C203 29.3 21.7 29.3 22.5 285L24 27C248 26.2 24.8 24.8 24 24L155 15.5" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
        {/* Right hand & fingers */}
        <path d="M29 20L205 285C197 29.3 18.3 29.3 17.5 285L16 27C152 26.2 15.2 24.8 16 24L245 15.5" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        {/* Thumbs overlapping */}
        <path d="M185 185C195 16.5 20.5 16.5 21.5 18.5" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
)

const EvolvedIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Antenna */}
        <path d="M20 11V4" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="3" r="2.5" fill="#FBBF24" />

        {/* Ear Bolts */}
        <rect x="6" y="17" width="3" height="8" rx="1.5" fill="#9CA3AF" />
        <rect x="31" y="17" width="3" height="8" rx="1.5" fill="#9CA3AF" />

        {/* Robot Head */}
        <rect x="8" y="11" width="24" height="20" rx="5" fill="#A7F3D0" stroke="#374151" strokeWidth="2" />

        {/* Screen */}
        <rect x="11" y="14" width="18" height="11" rx="2" fill="#1F2937" />

        {/* Glowing Eyes */}
        <circle cx="16" cy="19.5" r="1.5" fill="#34D399" />
        <circle cx="24" cy="19.5" r="1.5" fill="#34D399" />

        {/* Smile */}
        <path d="M17 22C185 23 21.5 23 23 22" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" />

        {/* Neck */}
        <rect x="17" y="31" width="6" height="4" fill="#9CA3AF" stroke="#374151" strokeWidth="2" />
    </svg>
)

const DeployableIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Fire Trail */}
        <path d="M11 29L4 36C3 37 1.5 37 0.5 36C-0.5 35 -0.5 33.5 0.5 325L7 26" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M13 27L8 32C75 32.5 6.5 32.5 6 32C55 31.5 5.5 30.5 6 30L11 25" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 31L5 35" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />

        {/* Fins */}
        <path d="M11 26L9 21L15 15" fill="#3B82F6" stroke="#1F2937" strokeWidth="1.5" />
        <path d="M26 11L21 9L15 15" fill="#3B82F6" stroke="#1F2937" strokeWidth="1.5" />

        {/* Main Rocket Body */}
        <path d="M12 28C14 28 17 26 21 22L31 12C335 9.5 33.5 6.5 31 4C285 1.5 25.5 1.5 23 4L13 14C9 18 7 21 7 23C7 26 9 28 12 28Z" fill="#F3F4F6" stroke="#1F2937" strokeWidth="1.5" />

        {/* Nose Cone */}
        <path d="M23 4L31 12C335 9.5 33.5 6.5 31 4C285 1.5 25.5 1.5 23 4Z" fill="#EF4444" stroke="#1F2937" strokeWidth="1.5" />

        {/* Port Window */}
        <circle cx="20.5" cy="15.5" r="3.5" fill="#93C5FD" stroke="#1F2937" strokeWidth="1.5" />
    </svg>
)

interface FeatureItem {
    title: string
    icon: React.ReactNode
}

const FEATURE_ITEMS: FeatureItem[] = [
    { title: 'Swift', icon: <SwiftIcon /> },
    { title: 'Product Focused', icon: <ProductFocusedIcon /> },
    { title: 'Expert-Led', icon: <ExpertLedIcon /> },
    { title: 'Evolved', icon: <EvolvedIcon /> },
    { title: 'Deployable', icon: <DeployableIcon /> },
]

export function Speed({ className }: SpeedProps) {
    // Parent motion variants for stagger fade in of the boxes
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const boxVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring' as const, stiffness: 260, damping: 20 },
        },
    }

    const hoverVariants: Variants = {
        rest: { scale: 1, x: 0, backgroundColor: '#F4F5F6' },
        hover: {
            scale: 1.015,
            x: 8,
            backgroundColor: '#ECEEEF',
            transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
        },
    }

    const iconHoverVariants: Variants = {
        rest: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.12,
            rotate: [0, -6, 6, 0],
            transition: { duration: 0.45, ease: 'easeInOut' as const },
        },
    }

    return (
        <section
            id="speed"
            aria-labelledby="speed-heading"
            className={cn('w-full bg-white py-16 md:py-28 overflow-hidden', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-stretch">

                {/* Left Side: Badge, Headers, and available-height Cover Image */}
                <div className="grid h-full min-h-0 grid-rows-[auto_1fr]">
                    <div>
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#F4F0FA] border border-[#E8E9EB]/50">
                            <div
                                className="w-2 h-2 rounded-full shrink-0 bg-[#8269CF]"
                                aria-hidden="true"
                            />
                            <span className="font-display font-medium text-[12px] leading-[140%] uppercase tracking-[0.05em] text-[#8269CF]">
                                • SPEED - THE AI SME PRODUCT ENGINE
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            id="speed-heading"
                            className="font-display font-semibold text-[36px] md:text-[48px] leading-[1.15] text-[#272829] mt-4"
                        >
                            Meet Speed
                        </h2>

                        {/* Subtitle */}
                        <p className="mt-4 font-body text-[16px] leading-[1.6] text-[#75777A]">
                            Swift, Product-Focused, Expert-Led, Evolved, Deployable Bonotech's cross-industry team turns product needs into smarter workflows & faster delivery AI-accelerated, but expert-led
                        </p>
                    </div>

                    {/* Image taking full half-width of the container and available height */}
                    <div className="mt-8 min-h-[320px] lg:min-h-0 relative rounded-[24px] overflow-hidden group shadow-xs">
                        <motion.img
                            src={robotSitting}
                            alt="Meet Speed Robot Assistant"
                            className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
                            initial={{ scale: 1.05, opacity: 0.95 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Right Side: Features boxes list */}
                <motion.div
                    className="flex flex-col gap-5 min-h-0"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {FEATURE_ITEMS.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={boxVariants}
                            className="w-full"
                        >
                            <motion.div
                                className="flex items-center gap-6 bg-[#F4F5F6] p-[24px] rounded-[16px] cursor-pointer"
                                variants={hoverVariants}
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                            >
                                {/* Icon container (40x40px) */}
                                <motion.div
                                    className="w-10 h-10 shrink-0 flex items-center justify-center"
                                    variants={iconHoverVariants}
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Text content (28px font, 600 weight) */}
                                <span className="font-display font-semibold text-[22px] md:text-[28px] leading-[120%] text-[#272829]">
                                    {item.title}
                                </span>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
