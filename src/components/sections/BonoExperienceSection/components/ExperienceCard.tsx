import { motion } from 'framer-motion'
import type { ExperienceCardData } from '../BonoExperienceSection.types'
import { ExperienceDiagram } from './ExperienceDiagram'

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 110, damping: 18 },
    },
}

interface ExperienceCardProps {
    card: ExperienceCardData
}

export function ExperienceCard({ card }: ExperienceCardProps) {
    const isHighlighted = card.isHighlighted

    return (
        <motion.article
            variants={cardVariants}
            className={[
                'relative flex h-full flex-col overflow-hidden rounded-[24px] p-6 sm:p-8',
                isHighlighted ? 'bg-[#8269CF]' : 'bg-[#F4F5F6]',
            ].join(' ')}
        >
            {isHighlighted && (
                <div
                    className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/[0.07]"
                    aria-hidden="true"
                />
            )}

            <div className="relative z-10 flex flex-1 flex-col">
                <h3
                    className={[
                        'font-display text-[22px] font-semibold leading-[1.2] sm:text-[24px]',
                        isHighlighted ? 'text-white' : 'text-[#313233]',
                    ].join(' ')}
                >
                    {card.title}
                </h3>
                <p
                    className={[
                        'mt-3 max-w-[34ch] font-body text-[15px] leading-[1.6] sm:text-[16px]',
                        isHighlighted ? 'text-white/85' : 'text-[#75777A]',
                    ].join(' ')}
                >
                    {card.description}
                </p>

                <div className="mt-auto">
                    <ExperienceDiagram
                        labels={card.labels}
                        variant={isHighlighted ? 'highlighted' : 'default'}
                    />
                </div>
            </div>
        </motion.article>
    )
}
