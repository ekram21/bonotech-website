import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimelineProps } from './Timeline.types'

const WebsiteIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Browser Frame */}
        <rect x="2" y="5" width="36" height="30" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Header Bar */}
        <path d="M2.75 11H37.25V8C37.25 6.34315 35.9069 5 34.25 5H5.75C4.09315 5 2.75 6.34315 2.75 8V11Z" fill="#F8FAFC" />
        {/* Window Controls */}
        <circle cx="7" cy="8" r="1.5" fill="#EF4444" />
        <circle cx="11.5" cy="8" r="1.5" fill="#F59E0B" />
        <circle cx="16" cy="8" r="1.5" fill="#10B981" />
        {/* Address Bar */}
        <rect x="21" y="6.5" width="14" height="3" rx="1.5" fill="#E2E8F0" />
        {/* Content Image / Block */}
        <rect x="6" y="15" width="28" height="16" rx="3" fill="#EBF3FF" />
        {/* Layout Mockup Elements */}
        {/* Sky/Background inside image */}
        <path d="M6 25L13 18L21 25L28 16L34 22V31H6V25Z" fill="#3B82F6" fillOpacity="0.4" />
        {/* Sun */}
        <circle cx="28" cy="19" r="2.5" fill="#FFAB50" />
    </svg>
)

const MobileIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Accent background circle */}
        <circle cx="20" cy="20" r="15" fill="#8269CF" fillOpacity="0.12" />
        {/* Phone Frame */}
        <rect x="13" y="5" width="14" height="30" rx="4" fill="#313233" stroke="#E2E8F0" strokeWidth="1" />
        {/* Screen */}
        <rect x="14.5" y="7" width="11" height="24" rx="2" fill="#4F46E5" />
        {/* Screen items */}
        <circle cx="20" cy="12" r="2" fill="#FFFFFF" fillOpacity="0.9" />
        <rect x="16" y="16" width="8" height="6" rx="1" fill="#FFFFFF" />
        <rect x="17.5" y="18" width="5" height="2.5" rx="0.5" fill="#FFAB50" />
        {/* Screen lines */}
        <rect x="16" y="24" width="8" height="1.2" rx="0.6" fill="#FFFFFF" fillOpacity="0.6" />
        <rect x="16" y="27" width="5" height="1.2" rx="0.6" fill="#FFFFFF" fillOpacity="0.4" />
        {/* Speaker / Notch */}
        <rect x="18" y="5.5" width="4" height="0.5" rx="0.25" fill="#1A1B1C" />
        {/* Soft hand styling */}
        <path d="M26.5 22.5C26.5 22.5 28.5 23.5 29 25C29.5 26.5 28 28.5 26 28L23.5 27" stroke="#FFAB50" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
)

const EnterpriseIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 shrink-0">
        {/* Monitor Frame */}
        <rect x="2" y="5" width="36" height="22" rx="4" fill="#313233" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Monitor Screen */}
        <rect x="3.5" y="6.5" width="33" height="19" rx="2.5" fill="#FFFFFF" />
        {/* Monitor Stand */}
        <path d="M18 27L16 34H24L22 27H18Z" fill="#4A5568" />
        {/* Monitor Base */}
        <rect x="13" y="34" width="14" height="2" rx="1" fill="#313233" />
        {/* Charts inside Monitor Screen */}
        {/* Pie Chart */}
        <circle cx="12" cy="16" r="6" fill="#8269CF" fillOpacity="0.15" />
        <path d="M12 16L12 10C15.3137 10 18 12.6863 18 16H12Z" fill="#FFAB50" />
        <path d="M12 16L18 16C18 19.3137 15.3137 22 12 22V16Z" fill="#3B82F6" />
        {/* Bar Charts */}
        <rect x="22" y="18" width="2.5" height="5" rx="0.5" fill="#8269CF" />
        <rect x="26" y="13" width="2.5" height="10" rx="0.5" fill="#FFAB50" />
        <rect x="30" y="9" width="2.5" height="14" rx="0.5" fill="#3B82F6" />
    </svg>
)

const TIMELINE_DATA = [
    {
        days: '3 Days',
        icon: <WebsiteIcon />,
        title: 'Website Development Timeline Starts From 3 Days',
        subtitle: 'Fast preview, focused content, and launch-ready structure.',
    },
    {
        days: '30 Days',
        icon: <MobileIcon />,
        title: 'Mobile app Launched in IOS and Android App Store Timeline Start From 30 Days',
        subtitle: 'App interface, engineering, testing, and deployment readiness.',
    },
    {
        days: '60 Days',
        icon: <EnterpriseIcon />,
        title: 'Enterprise Software Development Timeline Starts From 60 Days',
        subtitle: 'Scalable architecture, integrations, dashboards, and governance.',
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 100, damping: 16 },
    },
}

export function Timeline({ className }: TimelineProps) {
    return (
        <section
            id="timeline"
            aria-labelledby="timeline-heading"
            className={cn('w-full bg-white py-16 md:py-28', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center">
                {/* Top Pill Badge */}
                <div className="flex items-center gap-2 mb-4 py-1.5 px-4 rounded-full bg-[#F4F0FA] border border-[#E8E9EB]/50">
                    <div
                        className="w-2 h-2 rounded-full shrink-0 bg-[#8269CF]"
                        aria-hidden="true"
                    />
                    <span className="font-display font-medium text-[12px] leading-[140%] uppercase tracking-[0.05em] text-[#8269CF]">
                        Timeline
                    </span>
                </div>

                {/* Section Heading */}
                <h2
                    id="timeline-heading"
                    className="font-display font-semibold text-[36px] md:text-[48px] leading-[1.15] text-center text-[#313233] mb-4"
                >
                    The Bono fit Timeline
                </h2>

                {/* Subtitle */}
                <p className="max-w-[700px] font-body text-[16px] leading-[1.5] text-center text-[#75777A] mb-16 md:mb-20">
                    Bonotech is built to deliver shorter product cycles and faster results,
                    without compromising on quality or efficiency
                </p>

                {/* Timeline Grid */}
                <motion.div
                    className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    {TIMELINE_DATA.map((item) => (
                        <motion.div key={item.days} variants={itemVariants} className="flex flex-col h-full">
                            {/* Days Marker Banner */}
                            <div className="flex items-center gap-3 w-full mb-6 shrink-0">
                                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                                <div className="flex items-center gap-2 text-[#8269CF] text-[24px] font-[700] leading-none shrink-0 font-display">
                                    <Calendar className="w-6 h-6 text-[#8269CF] shrink-0" strokeWidth={2.2} />
                                    <span>{item.days}</span>
                                </div>
                                <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#8269CF]/30 to-[#8269CF]/50" />
                            </div>

                            {/* Card Content */}
                            <div className="group relative overflow-hidden flex-1 flex flex-col items-center text-center bg-[#F4F5F6] py-[24px] px-[16px] rounded-[24px] shadow-xs hover:bg-[#8269CF] hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer">
                                {/* Subtle background glow orb on hover */}
                                <div
                                    className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full bg-white/[0.06] translate-x-1/4 translate-y-1/4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    aria-hidden="true"
                                />

                                {/* Icon White Container */}
                                <div
                                    className="flex h-[72px] w-[72px] items-center justify-center rounded-[16px] bg-white p-[16px] mb-6 shadow-xs"
                                    aria-hidden="true"
                                >
                                    {item.icon}
                                </div>

                                {/* Card Title */}
                                <h3 className="font-display text-[20px] font-[700] leading-[1.3] text-[#313233] mb-3 max-w-[280px] group-hover:text-white transition-colors duration-300">
                                    {item.title}
                                </h3>

                                {/* Card Subtitle */}
                                <p className="font-body text-[16px] font-normal leading-[1.5] text-[#75777A] max-w-[280px] group-hover:text-white/80 transition-colors duration-300">
                                    {item.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
