import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import websiteWireframe from '@/assets/timeline/website-wireframe.png'
import mobileWireframe from '@/assets/timeline/mobile-wireframe.png'
import enterpriseWireframe from '@/assets/timeline/enterprise-wireframe.png'
import { CalendarWidget } from './components/CalendarWidget'
import { TimelineScrollCard } from './components/TimelineScrollCard'
import type { TimelineSectionItem, TimelineSectionProps } from './TimelineSection.types'

const TIMELINE_ITEMS: TimelineSectionItem[] = [
    {
        days: 3,
        daysLabel: '3 Days',
        badge: 'Website',
        title: 'Website Development Timeline Starts From 3 Days',
        subtitle: 'Fast preview, focused content, and launch-ready structure.',
        image: websiteWireframe,
    },
    {
        days: 30,
        daysLabel: '30 Days',
        badge: 'Mobile',
        title: 'Mobile App Launched in IOS and Android App Store Timeline Start From 30 Days',
        subtitle: 'App interface, engineering, testing, and deployment readiness.',
        image: mobileWireframe,
    },
    {
        days: 60,
        daysLabel: '60 Days',
        badge: 'Enterprise',
        title: 'Enterprise Software Development Timeline Starts From 60 Days',
        subtitle: "Scalable architecture, integrations, dashboards, and governance.",
        image: enterpriseWireframe,
    },
]

const NAVBAR_H = 80
const CARD_STACK_TOP_GAP = 10
const CARD_PIN_TOP = NAVBAR_H + CARD_STACK_TOP_GAP
const DESKTOP_BREAKPOINT = 1024

function TimelineBadge() {
    return (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#F5F3FB] px-4 py-1.5">
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#8269CF]" aria-hidden="true" />
            <span className="font-display text-[12px] font-medium uppercase tracking-[0.05em] text-[#8269CF]">
                TIMELINE
            </span>
        </div>
    )
}

function TimelineHeading({ id }: { id?: string }) {
    return (
        <div>
            <TimelineBadge />
            <h2
                id={id}
                className="font-display text-[36px] font-semibold leading-[1.12] text-[#272829] lg:text-[48px]"
            >
                The Bono-Fit Timeline
            </h2>
            <p className="mt-4 max-w-[500px] font-body text-[16px] leading-[1.6] text-[#75777A] lg:text-[17px]">
                Bonotech is built to deliver shorter product cycles and faster results, without
                compromising on quality or efficiency.
            </p>
        </div>
    )
}

export function TimelineSection({ className }: TimelineSectionProps) {
    const runwayRef = useRef<HTMLDivElement>(null)
    const cardEls = useRef<(HTMLDivElement | null)[]>([])

    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_BREAKPOINT)
    const [dims, setDims] = useState(() => ({
        cardH: 610,
        viewportH: window.innerHeight,
    }))
    const [activeIndex, setActiveIndex] = useState(0)

    const measureCards = useCallback(() => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        setIsDesktop(vw >= DESKTOP_BREAKPOINT)

        const heights = cardEls.current
            .map((el) => {
                const article = el?.querySelector('article')
                return article?.offsetHeight ?? el?.offsetHeight ?? 0
            })
            .filter((height) => height > 0)

        setDims({
            cardH: heights.length ? Math.max(...heights) : 610,
            viewportH: vh,
        })
    }, [])

    useLayoutEffect(() => {
        measureCards()
        window.addEventListener('resize', measureCards)

        let observer: ResizeObserver | undefined
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(measureCards)
            cardEls.current.forEach((el) => {
                if (el) observer?.observe(el)
            })
        }

        return () => {
            window.removeEventListener('resize', measureCards)
            observer?.disconnect()
        }
    }, [isDesktop, measureCards])

    const { cardH, viewportH } = dims
    const cardAreaH = cardH
    const scrollPerCard = isDesktop ? Math.max(cardH * 1.4, 560) : Math.max(cardH * 0.5, 300)
    const stickyContentH = cardAreaH
    const availableH = Math.max(viewportH - CARD_PIN_TOP - 48, 320)
    const stickyScale = stickyContentH > 0 ? Math.min(1, availableH / stickyContentH) : 1
    const effectiveScrollPerCard = scrollPerCard / stickyScale
    const totalCardScroll = effectiveScrollPerCard * (TIMELINE_ITEMS.length - 1)
    const runwayH = stickyContentH + totalCardScroll

    useEffect(() => {
        if (!isDesktop) return

        let rafId: number

        const update = () => {
            if (!runwayRef.current) return
            const rect = runwayRef.current.getBoundingClientRect()
            const progress = Math.max(0, CARD_PIN_TOP - rect.top)

            let nextActiveIndex = 0
            for (let i = 1; i < TIMELINE_ITEMS.length; i++) {
                const animStart = (i - 1) * effectiveScrollPerCard
                const t = Math.min(
                    1,
                    Math.max(0, (progress - animStart) / effectiveScrollPerCard),
                )
                if (t >= 1) nextActiveIndex = i
            }
            setActiveIndex(nextActiveIndex)

            cardEls.current.forEach((el, i) => {
                if (!el) return

                if (i === 0) {
                    el.style.transform = 'translateY(0px)'
                    return
                }

                const animStart = (i - 1) * effectiveScrollPerCard
                const t = Math.min(
                    1,
                    Math.max(0, (progress - animStart) / effectiveScrollPerCard),
                )

                const entryY = cardAreaH + 250
                const y = entryY + (0 - entryY) * t
                el.style.transform = `translateY(${y}px)`
            })
        }

        const handleScroll = () => {
            cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(update)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
            cancelAnimationFrame(rafId)
        }
    }, [isDesktop, effectiveScrollPerCard, cardAreaH])

    useEffect(() => {
        if (isDesktop) return

        const cards = cardEls.current.filter(Boolean) as HTMLDivElement[]
        if (!cards.length) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

                if (!visible.length) return
                const index = Number(visible[0].target.getAttribute('data-index'))
                if (!Number.isNaN(index)) setActiveIndex(index)
            },
            { threshold: [0.35, 0.55, 0.75], rootMargin: '-20% 0px -35% 0px' },
        )

        cards.forEach((card) => observer.observe(card))
        return () => observer.disconnect()
    }, [isDesktop])

    const activeItem = TIMELINE_ITEMS[activeIndex] ?? TIMELINE_ITEMS[0]

    return (
        <section
            id="timeline"
            aria-labelledby="timeline-heading"
            className={cn('w-full bg-white py-20 lg:py-28', className)}
        >
            <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                {!isDesktop && (
                    <div className="mb-10">
                        <TimelineHeading id="timeline-heading" />
                        <div className="mt-10">
                            <CalendarWidget days={activeItem.days} badge={activeItem.badge} />
                        </div>
                    </div>
                )}

                <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
                    {isDesktop && (
                        <div
                            className="sticky self-start"
                            style={{ top: CARD_PIN_TOP }}
                        >
                            <TimelineHeading id="timeline-heading" />
                            <div className="mt-12">
                                <CalendarWidget days={activeItem.days} badge={activeItem.badge} />
                            </div>
                        </div>
                    )}

                    {!isDesktop ? (
                        <div className="flex flex-col gap-8">
                            {TIMELINE_ITEMS.map((item, index) => (
                                <div
                                    key={item.days}
                                    ref={(el) => {
                                        cardEls.current[index] = el
                                    }}
                                    data-index={index}
                                >
                                    <TimelineScrollCard item={item} onImageLoad={measureCards} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div ref={runwayRef} className="relative" style={{ height: runwayH }}>
                            <div
                                className="sticky overflow-visible"
                                style={{
                                    top: CARD_PIN_TOP,
                                    height: stickyContentH * stickyScale,
                                }}
                            >
                                <div
                                    className="overflow-visible"
                                    style={{
                                        transform: `scale(${stickyScale})`,
                                        transformOrigin: 'top center',
                                        height: stickyContentH,
                                        maxHeight: stickyContentH,
                                    }}
                                >
                                    <div
                                        className="relative overflow-visible"
                                        style={{
                                            height: cardAreaH,
                                            clipPath: 'inset(-200px -200px -300px -200px)',
                                        }}
                                    >
                                        {TIMELINE_ITEMS.map((item, index) => (
                                            <div
                                                key={item.days}
                                                ref={(el) => {
                                                    cardEls.current[index] = el
                                                }}
                                                className="absolute inset-x-0 top-0 flex justify-center will-change-transform"
                                                style={{ zIndex: index + 1 }}
                                            >
                                                <TimelineScrollCard item={item} onImageLoad={measureCards} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
