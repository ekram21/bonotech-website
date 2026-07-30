import { ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectCardProps } from '../Projects.types'

import playStoreImg from '@/assets/playstore.png'
import appStoreImg from '@/assets/apple-store.png'

const DEFAULT_BULLET_COLOR = '#8269CF'

function logoClampSize(px: number) {
    return `clamp(${(px * 0.5).toFixed(1)}px, ${(px / 1280 * 100).toFixed(2)}vw, ${px}px)`
}

function openExternalUrl(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
}

function BuildDaysIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0"
        >
            <path
                d="M2.5 6.91651C2.5 4.70737 4.29086 2.9165 6.5 2.9165L13.5 2.9165C15.7091 2.9165 17.5 4.70737 17.5 6.9165V14.3332C17.5 16.5423 15.7091 18.3332 13.5 18.3332H6.5C4.29086 18.3332 2.5 16.5423 2.5 14.3332L2.5 6.91651Z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            <path
                d="M2.5 7.5L17.5 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M6.66699 1.6665L6.66699 4.1665"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.333 1.6665V4.1665"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="10.0003" cy="12.4998" r="0.833333" fill="currentColor" />
            <circle cx="13.3333" cy="12.4998" r="0.833333" fill="currentColor" />
            <circle cx="6.66634" cy="12.4998" r="0.833333" fill="currentColor" />
        </svg>
    )
}

export function ProjectCard({ project }: ProjectCardProps) {
    const bulletColor = project.bulletColor ?? DEFAULT_BULLET_COLOR
    const hasStoreBadges = !!(project.playStoreHref || project.appStoreHref)

    const learnMoreDesktop = project.learnMoreHref ? (
        <a
            href={project.learnMoreHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                openExternalUrl(project.learnMoreHref!)
            }}
            className="hidden md:inline-flex items-center gap-1.5 self-start font-body font-medium leading-[1.4] text-content-accent text-xs xl:text-sm"
        >
            Learn More
            <ArrowRight className="w-4 h-4" />
        </a>
    ) : null

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
                    className={
                        project.iconCover
                            ? 'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]'
                            : 'absolute inset-0 flex items-center justify-center pointer-events-none'
                    }
                    aria-hidden="true"
                >
                    <img
                        src={project.iconSrc}
                        alt=""
                        className={
                            project.iconCover
                                ? 'h-full w-full object-cover rounded-[inherit]'
                                : 'object-contain'
                        }
                        style={
                            project.iconCover
                                ? { opacity: project.opacity ? project.opacity / 100 : 1 }
                                : {
                                      ...(project.iconHeight ? { height: project.iconHeight } : {}),
                                      ...(project.iconWidth ? { width: project.iconWidth } : {}),
                                      maxWidth: '100%',
                                      maxHeight: '90%',
                                      opacity: project.opacity ? project.opacity / 100 : 1,
                                  }
                        }
                    />
                </div>
            )}

            {/* Left Content */}
            <div className="relative z-10 flex flex-col items-center md:items-end justify-end shrink-0 flex-1 gap-4 self-stretch text-center md:text-right order-2 md:order-1">
                {/* Category Pill — text & padding scale to original at xl */}
                <span
                    className="inline-flex items-center justify-center font-body font-medium leading-[1.4] tracking-[0.01em] rounded-full border
                               text-xs px-3 py-2
                               lg:text-xs lg:px-3.5 lg:py-2.5
                               xl:text-sm xl:px-4 xl:py-3"
                    style={{
                        borderColor: project.borderColor,
                        backgroundColor: project.buttonColor,
                        color: project.categoryTextColor ?? '#ffffff',
                    }}
                >
                    {project.category}
                </span>

                {project.builtInDays && (
                    <div
                        className="inline-flex items-center gap-2 font-body text-[18px] font-semibold leading-none tracking-[-0.005em]"
                        style={{ color: project.builtInDaysColor ?? '#B69A6B' }}
                    >
                        <BuildDaysIcon />
                        <span>{project.builtInDays}</span>
                    </div>
                )}

                {/* Title — scales to original 28 px at xl */}
                <h3 className="font-body font-semibold leading-[1.2] tracking-[-0.005em] text-content-accent
                               text-[22px] lg:text-[25px] xl:text-[28px]">
                    {project.title}
                </h3>

                {/* Feature list — bullets left on mobile, right on desktop */}
                <ul
                    className="flex flex-col gap-2 w-full max-w-100 list-none m-0 p-0"
                    aria-label={`${project.title} features`}
                >
                    {project.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex flex-row-reverse md:flex-row items-center justify-center md:justify-end gap-2.5 font-body font-normal leading-normal tracking-[-0.016em] text-content-accent-dark text-[13px] lg:text-sm xl:text-base"
                        >
                            <span>{feature}</span>
                            <span
                                className="w-2 h-2 shrink-0 rounded-full"
                                style={{ backgroundColor: bulletColor }}
                                aria-hidden="true"
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Center Mockup — scales to original w-77.5 at xl */}
            <div className="relative z-10 flex items-center justify-center shrink-0 order-1 md:order-2 overflow-visible">
                <div
                    className={cn(
                        'relative flex items-center justify-center overflow-visible',
                        project.mockupWidth ? 'w-auto' : 'w-60 md:w-44 lg:w-56 xl:w-77.5',
                    )}
                    style={
                        project.mockupWidth
                            ? { width: logoClampSize(project.mockupWidth) }
                            : undefined
                    }
                >
                    <img
                        src={project.mockupSrc}
                        alt={`${project.title} mockup`}
                        className="h-auto w-full drop-shadow-[0px_0px_120px_rgba(0,0,0,0.3)]"
                        style={{
                            ...(project.mockupScale
                                ? {
                                      transform: `scale(${project.mockupScale})`,
                                      transformOrigin: 'center center',
                                  }
                                : {}),
                            ...(project.mockupBlendMode
                                ? { mixBlendMode: project.mockupBlendMode }
                                : {}),
                        }}
                    />
                </div>
            </div>

            {/* Right Content */}
            <div
                className={cn(
                    'relative z-10 flex flex-col items-center md:items-start justify-end shrink-0 flex-1 self-stretch order-3',
                    hasStoreBadges ? 'gap-6 md:gap-5 xl:gap-8' : 'gap-4',
                )}
            >
                <div className={`flex gap-3 font-bold`} style={{ color: project.buildColor }}>
                    <Calendar
                    color={project.buildColor}
                    strokeWidth={2}
                    />
                    <p>Build In 60 Days</p>
                </div>
                {project.logoSrc && (
                    <div
                        className={cn(
                            'flex flex-col items-center md:items-start',
                            !hasStoreBadges && project.learnMoreHref && 'gap-3 xl:gap-4',
                        )}
                    >
                        <img
                            src={project.logoSrc}
                            alt={project.logoAlt || ''}
                            className="block shrink-0"
                            style={{
                                ...(project.logoDark ? { filter: 'brightness(0)' } : {}),
                                ...(project.logoBlendMode
                                    ? { mixBlendMode: project.logoBlendMode }
                                    : {}),
                                width: project.logoWidth
                                    ? logoClampSize(project.logoWidth)
                                    : 'auto',
                                height: project.logoHeight
                                    ? logoClampSize(project.logoHeight)
                                    : '3rem',
                                objectFit: 'contain',
                            }}
                        />
                        {!hasStoreBadges && learnMoreDesktop}
                    </div>
                )}

                {/* Store Badges — original h-10 at xl */}
                {hasStoreBadges && (
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

                {hasStoreBadges && learnMoreDesktop}
            </div>

            {/* Learn More — Mobile only, at bottom */}
            {project.learnMoreHref && (
                <a
                    href={project.learnMoreHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        openExternalUrl(project.learnMoreHref!)
                    }}
                    className="md:hidden w-full flex items-center justify-center font-body text-sm font-medium leading-[1.4] text-content-accent order-4"
                >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
            )}
        </div>
    )
}
