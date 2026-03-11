import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import type { ProjectCardProps } from '../Projects.types'

import playStoreImg from '@/assets/playstore.png'
import appStoreImg from '@/assets/apple-store.png'

/** Max chars to show before "See more" is offered */
const SUBTITLE_LIMIT = 130

export function ProjectCard({ project }: ProjectCardProps) {
    const needsTruncation = project.subtitle.length > SUBTITLE_LIMIT
    const [expanded, setExpanded] = useState(false)

    const displayedSubtitle =
        needsTruncation && !expanded
            ? project.subtitle.slice(0, SUBTITLE_LIMIT).trimEnd() + '…'
            : project.subtitle

    return (
        <div
            className={[
                'relative w-full overflow-hidden',
                'flex flex-col md:flex-row items-center',
                // max-width & border-radius — unchanged from original
                'max-w-328 rounded-4xl border',
                // min-height: grows with intermediate breakpoints, hits original at xl
                'min-h-auto md:min-h-88 lg:min-h-112 xl:min-h-146.5',
                // Padding: mobile original → scaled intermediate → desktop original at xl
                'px-6 py-12',
                'md:px-5 md:pt-14 md:pb-14',
                'lg:px-6 lg:pt-18 lg:pb-18',
                'xl:px-8 xl:pt-22 xl:pb-22',
                // Gap: mobile original → scaled intermediate → desktop original at xl
                'gap-8 md:gap-7 lg:gap-9 xl:gap-12',
            ].join(' ')}
            style={{
                borderColor: project.borderColor,
                backgroundColor: project.backgroundColor,
            }}
        >
            {/* Background Icon — centered, fills full height */}
            {project.iconSrc && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                >
                    <img
                        src={project.iconSrc}
                        alt=""
                        className="object-contain"
                        style={{
                            ...(project.iconHeight ? { height: project.iconHeight } : {}),
                            ...(project.iconWidth ? { width: project.iconWidth } : {}),
                            maxWidth: '100%',
                            maxHeight: '90%',
                            opacity: project.opacity ? project.opacity / 100 : 1,
                        }}
                    />
                </div>
            )}

            {/* Left Content */}
            <div className="relative z-10 flex flex-col items-center md:items-end justify-end shrink-0 flex-1 gap-4 self-stretch text-center md:text-right order-2 md:order-1">
                {/* Category Pill — text & padding scale to original at xl */}
                <span
                    className="inline-flex items-center justify-center font-body font-medium leading-[1.4] tracking-[0.01em] text-white rounded-full border
                               text-xs px-3 py-2
                               lg:text-xs lg:px-3.5 lg:py-2.5
                               xl:text-sm xl:px-4 xl:py-3"
                    style={{
                        borderColor: project.borderColor,
                        backgroundColor: project.buttonColor,
                    }}
                >
                    {project.category}
                </span>

                {/* Title — scales to original 28 px at xl */}
                <h3 className="font-body font-semibold leading-[1.2] tracking-[-0.005em] text-content-accent
                               text-[22px] lg:text-[25px] xl:text-[28px]">
                    {project.title}
                </h3>

                {/* Subtitle + See More toggle */}
                <div className="max-w-100">
                    <p className="font-body font-normal leading-normal tracking-[-0.016em] text-content-accent-dark
                                  text-[13px] lg:text-sm xl:text-base">
                        {displayedSubtitle}
                    </p>
                    {needsTruncation && (
                        <button
                            onClick={() => setExpanded((v) => !v)}
                            className="mt-1 inline-flex items-center gap-1 font-body font-medium
                                       text-[13px] xl:text-sm text-content-accent
                                       underline-offset-2 hover:underline focus-visible:outline-none"
                            aria-expanded={expanded}
                        >
                            {expanded ? 'See less' : 'See more'}
                            <ArrowRight
                                className="w-3.5 h-3.5 shrink-0 transition-transform duration-200"
                                style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Center Mockup — scales to original w-77.5 at xl */}
            <div className="relative z-10 flex items-center justify-center shrink-0 order-1 md:order-2">
                <img
                    src={project.mockupSrc}
                    alt={`${project.title} mockup`}
                    className="h-auto drop-shadow-[0px_0px_120px_rgba(0,0,0,0.3)]
                               w-60 md:w-44 lg:w-56 xl:w-77.5"
                />
            </div>

            {/* Right Content */}
            <div
                className={`relative z-10 flex flex-col items-center md:items-start justify-end shrink-0 flex-1 self-stretch order-3 ${project.logoSrc ? 'gap-6 md:gap-5 xl:gap-8' : 'gap-4'
                    }`}
            >
                {/* Logo — uses clamp() only for its pixel-spec'd dimensions */}
                {project.logoSrc && (
                    <div className="flex items-center">
                        <img
                            src={project.logoSrc}
                            alt={project.logoAlt || ''}
                            style={{
                                ...(project.logoDark ? { filter: 'brightness(0)' } : {}),
                                /*
                                 * Logos have spec'd pixel dimensions; we use clamp() so
                                 * they scale down proportionally between breakpoints but
                                 * always reach their full original size at 1280 px (xl).
                                 *
                                 * Formula: clamp(floor * spec, spec/1280 * 100vw, spec)
                                 * → at ≥1280 px the `max` wins, capping at the original spec.
                                 * → below 1280 px the vw term shrinks them proportionally.
                                 */
                                width: project.logoWidth
                                    ? `clamp(${(project.logoWidth * 0.5).toFixed(1)}px, ${(project.logoWidth / 1280 * 100).toFixed(2)}vw, ${project.logoWidth}px)`
                                    : undefined,
                                height: project.logoHeight
                                    ? `clamp(${(project.logoHeight * 0.5).toFixed(1)}px, ${(project.logoHeight / 1280 * 100).toFixed(2)}vw, ${project.logoHeight}px)`
                                    : '3rem',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                )}

                {/* Store Badges — original h-10 at xl */}
                {(project.playStoreHref || project.appStoreHref) && (
                    <div className="flex items-center flex-wrap gap-2">
                        {project.playStoreHref && (
                            <a
                                href={project.playStoreHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Get it on Google Play"
                            >
                                <img
                                    src={playStoreImg}
                                    alt="Google Play"
                                    className="h-8 lg:h-9 xl:h-10 w-auto"
                                />
                            </a>
                        )}
                        {project.appStoreHref && (
                            <a
                                href={project.appStoreHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Download on the App Store"
                            >
                                <img
                                    src={appStoreImg}
                                    alt="App Store"
                                    className="h-8 lg:h-9 xl:h-10 w-auto"
                                />
                            </a>
                        )}
                    </div>
                )}

                {/* Learn More — Desktop only; original text-sm at xl */}
                {project.learnMoreHref && (
                    <a
                        href={project.learnMoreHref}
                        className="hidden md:inline-flex items-center gap-1.5 font-body font-medium leading-[1.4] text-content-accent
                                   text-xs xl:text-sm"
                    >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Learn More — Mobile only, at bottom */}
            {project.learnMoreHref && (
                <a
                    href={project.learnMoreHref}
                    className="md:hidden w-full flex items-center justify-center font-body text-sm font-medium leading-[1.4] text-content-accent order-4"
                >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
            )}
        </div>
    )
}
