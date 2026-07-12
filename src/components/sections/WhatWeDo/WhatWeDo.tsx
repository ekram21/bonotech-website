import { cn } from '@/lib/utils'
import type { WhatWeDoProps, ServiceCard } from './WhatWeDo.types'
import { ServiceCardItem } from './components/ServiceCardItem'

import appsRemoveIcon from '@/assets/icons/apps-remove.svg'
import layersIcon from '@/assets/icons/layers.svg'
import inputCursorMoveIcon from '@/assets/icons/input-cursor-move.svg'
import compassIcon from '@/assets/icons/compass.svg'
import likeIcon from '@/assets/icons/like.svg'
import callUserIcon from '@/assets/icons/call-user.svg'

const SERVICE_CARDS: ServiceCard[] = [
    {
        icon: appsRemoveIcon,
        title: 'Accelerated MVP\nDevelopment',
        hoverColor: '#1A85AB',
        glowColor: '#7F8FF566',
    },
    {
        icon: layersIcon,
        title: 'Mobile Application\nDevelopment',
        hoverColor: '#DD6CFA',
        glowColor: '#B87FF566',
    },
    {
        icon: inputCursorMoveIcon,
        title: 'Web Application\nDevelopment',
        hoverColor: '#C9447D',
        glowColor: '#F57FCE66',
    },
    {
        icon: compassIcon,
        title: 'Website Design &\nDevelopment',
        hoverColor: '#73FFCC',
        glowColor: '#F57F8166',
    },
    {
        icon: likeIcon,
        title: 'User Experience/\nInterface Design',
        hoverColor: '#F8B851',
        glowColor: '#F5C87F66',
    },
    {
        icon: callUserIcon,
        title: 'Custom AI\nSolutions',
        hoverColor: '#516DF8',
        glowColor: '#F5C87F66',
    },
]

export function WhatWeDo({ className }: WhatWeDoProps) {
    return (
        <section
            id="what-we-do"
            aria-labelledby="what-we-do-heading"
            className={cn(
                'relative w-full overflow-hidden bg-surface-accent',
                className
            )}
        >
            {/* Background gradient overlay */}
            <div
                className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(180deg,#6DA9EE_0%,#31C7BF_100%)]"
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) py-16 md:py-28 flex flex-col items-center">
                {/* Top Pill Badge */}
                <div className="mb-3 flex items-center gap-2 rounded-full border-[0.5px] border-[#374B5C] bg-[#2A3946] px-4 py-1.5">
                    <div
                        className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]"
                        aria-hidden="true"
                    />
                    <span className="font-display text-[12px] font-semibold leading-none tracking-[0] text-content-white">
                        HOW WE HELP
                    </span>
                </div>

                {/* Heading */}
                <h2
                    id="what-we-do-heading"
                    className="font-display font-semibold text-2xl md:text-[32px] leading-[125%] text-center text-content-white mb-8 md:mb-10"
                >
                    Blazing Fast Execution
                    <br />
                    <span className="text-[#B0E0E6]">Unbeatable Prices</span>
                </h2>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-[10px] w-full md:max-w-none">
                    {SERVICE_CARDS.map((card) => (
                        <ServiceCardItem key={card.title} card={card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
