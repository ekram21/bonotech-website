import { useState } from 'react'
import { cn } from '@/lib/utils'

import hospitalityIcon from '@/assets/icons/industries/hospitality.svg'
import financeIcon from '@/assets/icons/industries/finance.svg'
import educationIcon from '@/assets/icons/industries/education.svg'
import realEstateIcon from '@/assets/icons/industries/real-estate.svg'
import healthcareIcon from '@/assets/icons/industries/healthcare.svg'

interface IndustryCard {
    icon: string
    title: string
    hoverColor: string
    glowColor: string
}

const INDUSTRY_CARDS: IndustryCard[] = [
    {
        icon: hospitalityIcon,
        title: 'Hospitality',
        hoverColor: '#1A85AB',
        glowColor: '#7F8FF566',
    },
    {
        icon: financeIcon,
        title: 'Finance',
        hoverColor: '#DD6CFA',
        glowColor: '#B87FF566',
    },
    {
        icon: educationIcon,
        title: 'Education',
        hoverColor: '#C9447D',
        glowColor: '#F57FCE66',
    },
    {
        icon: realEstateIcon,
        title: 'Real Estate',
        hoverColor: '#F8B851',
        glowColor: '#F5C87F66',
    },
    {
        icon: healthcareIcon,
        title: 'Healthcare',
        hoverColor: '#73FFCC',
        glowColor: '#F57F8166',
    },
]

function IndustryCardItem({ card }: { card: IndustryCard }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="relative w-full md:w-[296px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={cn(
                    'absolute -inset-5 rounded-[48px] transition-opacity duration-500 pointer-events-none blur-[70px]',
                    isHovered ? 'opacity-100' : 'opacity-50'
                )}
                style={{ background: card.glowColor }}
                aria-hidden="true"
            />

            <div className="relative w-full min-h-[140px] md:min-h-[172px] rounded-[48px] p-5 md:p-8 flex flex-col items-center justify-center gap-3 overflow-hidden cursor-pointer bg-[#243240] z-100 transition-all duration-500 ease-out">
                <div
                    className={cn(
                        'absolute inset-0 rounded-[48px] transition-opacity duration-500 ease-out',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                        background: `radial-gradient(ellipse at center, ${card.hoverColor} 0%, #243240 150%)`,
                    }}
                    aria-hidden="true"
                />

                <img
                    src={card.icon}
                    alt=""
                    className="relative z-10 w-8 h-8"
                    aria-hidden="true"
                />

                <h3 className="relative z-10 font-display font-bold text-base md:text-xl leading-[140%] text-content-white text-center">
                    {card.title}
                </h3>
            </div>
        </div>
    )
}

export function Industries({ className }: { className?: string }) {
    return (
        <section
            id="bono-xperience"
            aria-labelledby="industries-heading"
            className={cn(
                'relative w-full overflow-hidden bg-surface-accent',
                className
            )}
        >
            <div
                className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(180deg,#6DA9EE_0%,#31C7BF_100%)]"
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) py-16 md:py-28 flex flex-col items-center">
                <div className="mb-3 flex items-center gap-2 rounded-full border-[0.5px] border-[#374B5C] bg-[#2A3946] px-4 py-1.5">
                    <div
                        className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]"
                        aria-hidden="true"
                    />
                    <span className="font-display text-[12px] font-semibold leading-none tracking-[0] text-content-white">
                        INDUSTRIES
                    </span>
                </div>

                <h2
                    id="industries-heading"
                    className="font-display font-semibold text-[32px] leading-[125%] tracking-[0] text-center text-content-white mb-4"
                >
                    Industries We Innovate
                </h2>

                <p className="max-w-[520px] text-center font-body text-[16px] font-normal leading-[150%] tracking-[-0.25px] text-content-white mb-8 md:mb-10">
                    We build across industries, constantly expanding our portfolio as we take on new challenges and create new solutions.
                </p>

                <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-[10px] max-w-[1250px] md:max-w-none">
                    {INDUSTRY_CARDS.map((card) => (
                        <IndustryCardItem key={card.title} card={card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
