import { useEffect, useRef, useState } from 'react'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { Mail, Phone, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CalendlyLoader } from './CalendlyLoader'
import type { SchedulingProps } from './Scheduling.types'

const DEFAULT_CALENDLY_URL =
    import.meta.env.VITE_CALENDLY_URL ?? 'https://calendly.com/meetingsbonotech/30min'

const MOBILE_BREAKPOINT = 1024
const MOBILE_WIDGET_HEIGHT = 760
const DESKTOP_WIDGET_HEIGHT = 700

// Calendly's desktop booking page renders a fixed-width card centered
// inside a wider iframe. Crop the sides on wide wrappers; on narrower
// desktops the card is full-bleed and needs no horizontal crop.
const CARD_TOP_GAP = 0
const CARD_WIDTH = 678 // must match the lg:max-w-[678px] on the wrapper below
const WIDE_IFRAME_WIDTH = 880

const CALENDLY_PAGE_SETTINGS = {
    backgroundColor: 'ffffff',
    hideLandingPageDetails: true,
    primaryColor: '1B4BA9',
    textColor: '272829',
    hideGdprBanner: true,
} as const

function disableIframeScroll(iframe: HTMLIFrameElement) {
    iframe.setAttribute('scrolling', 'no')
    iframe.style.overflow = 'hidden'
}

export function Scheduling({ className, calendlyUrl = DEFAULT_CALENDLY_URL }: SchedulingProps) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)
    const wrapperRef = useRef<HTMLDivElement>(null)
    // true when the wrapper is wide enough for the fixed 678px card,
    // false on narrower desktops where the full-bleed layout is used
    const [fitsCard, setFitsCard] = useState(true)
    const [showCalendlyLoader, setShowCalendlyLoader] = useState(true)
    const [calendlyPageHeight, setCalendlyPageHeight] = useState<number | null>(null)

    const visibleHeight = isMobile ? MOBILE_WIDGET_HEIGHT : DESKTOP_WIDGET_HEIGHT

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => {
            setFitsCard(entry.contentRect.width >= CARD_WIDTH)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useCalendlyEventListener({
        onPageHeightResize: (event) => {
            const height = event.data?.payload?.height
            if (typeof height === 'number' && height > 0) {
                setCalendlyPageHeight(height)
            }
        },
        onProfilePageViewed: () => {
            window.setTimeout(() => setShowCalendlyLoader(false), 300)
        },
        onEventTypeViewed: () => {
            window.setTimeout(() => setShowCalendlyLoader(false), 300)
        },
        onDateAndTimeSelected: () => {
            window.setTimeout(() => setShowCalendlyLoader(false), 300)
        },
        onEventScheduled: () => setShowCalendlyLoader(false),
    })

    useEffect(() => {
        const fallbackTimer = window.setTimeout(() => {
            setShowCalendlyLoader(false)
        }, 4500)

        return () => window.clearTimeout(fallbackTimer)
    }, [])

    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return

        let currentIframe: HTMLIFrameElement | null = null

        const handleLoad = () => {
            setShowCalendlyLoader(true)

            window.setTimeout(() => {
                setShowCalendlyLoader(false)
            }, 900)
        }

        const attachIframeLoadListener = () => {
            const iframe = wrapper.querySelector('iframe')

            if (!iframe || iframe === currentIframe) return

            if (currentIframe) {
                currentIframe.removeEventListener('load', handleLoad)
            }

            currentIframe = iframe
            disableIframeScroll(currentIframe)
            currentIframe.addEventListener('load', handleLoad)
        }

        const observer = new MutationObserver(() => {
            attachIframeLoadListener()
        })

        observer.observe(wrapper, {
            childList: true,
            subtree: true,
        })

        attachIframeLoadListener()

        return () => {
            observer.disconnect()

            if (currentIframe) {
                currentIframe.removeEventListener('load', handleLoad)
            }
        }
    }, [calendlyPageHeight, isMobile, fitsCard])

    const iframeHeight = calendlyPageHeight ?? visibleHeight

    const widgetStyles = isMobile
        ? {
              position: 'absolute' as const,
              top: 0,
              left: 0,
              width: '100%',
              height: `${iframeHeight}px`,
          }
        : fitsCard
          ? {
                position: 'absolute' as const,
                top: -CARD_TOP_GAP,
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${WIDE_IFRAME_WIDTH}px`,
                height: `${iframeHeight}px`,
            }
          : {
                position: 'absolute' as const,
                top: -CARD_TOP_GAP,
                left: 0,
                width: '100%',
                height: `${iframeHeight}px`,
            }

    return (
        <section
            id="schedule"
            aria-labelledby="schedule-heading"
            className={cn('w-full bg-[#fafafa] py-20 md:py-28', className)}
        >
            <div className="relative mx-auto w-full max-w-(--width-container) px-(--spacing-container-x)">
                <div className="flex flex-col lg:flex-row lg:center gap-12 lg:gap-10 xl:gap-14 w-full">
                    {/* ─── Left Content ─── */}
                    <div className="w-full lg:w-[340px] xl:w-[480px] lg:shrink-0 flex flex-col gap-12 lg:justify-between lg:min-h-[700px] py-16">
                        <div>
                            <h2
                                id="schedule-heading"
                                className="font-display font-semibold text-[#131314] text-[40px] sm:text-[48px] leading-[1.15] tracking-tight mb-4"
                            >
                                Schedule a free discovery call
                            </h2>
                            <p className="font-body text-[#444547] text-[18px] leading-[1.6] max-w-xl">
                                Schedule a 30-min free discovery call with our Bono-Pros. Our
                                experts will evaluate your business needs and goals to translate
                                them into market-ready business products.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 lg:mt-0 lg:pt-0">
                            <div className="flex items-center gap-4">
                                <div
                                    className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full text-[#131314] shrink-0"
                                    aria-hidden="true"
                                >
                                    <Mail size={16} />
                                </div>
                                <a
                                    href="mailto:contact@bonotech.io"
                                    className="font-body text-[16px] text-[#272829] hover:underline"
                                >
                                    contact@bonotech.io
                                </a>
                            </div>

                            <div className="flex items-center gap-4">
                                <div
                                    className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full text-[#131314] shrink-0"
                                    aria-hidden="true"
                                >
                                    <Phone size={16} />
                                </div>
                                <a
                                    href="tel:+447551829217"
                                    className="font-body text-[16px] text-[#272829] hover:underline"
                                >
                                    +44 7551 829217
                                </a>
                            </div>

                            <div className="flex items-start gap-4">
                                <div
                                    className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full text-[#131314] shrink-0 mt-0.5"
                                    aria-hidden="true"
                                >
                                    <MapPin size={16} />
                                </div>
                                <span className="font-body text-[16px] text-[#272829] leading-relaxed max-w-sm">
                                    Bonotech Holdings PTE LTD. 111 Somerset Road, #08-10A, Singapore
                                    238164
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ─── Right: Calendly Widget ─── */}
                    <div className="w-full lg:flex-1 lg:min-w-0 lg:max-h-[700px] lg:overflow-hidden">
                        <div
                            ref={wrapperRef}
                            className="schedule-calendly-host relative w-full overflow-hidden lg:ml-auto lg:max-w-[678px] h-[760px] lg:h-[700px] max-h-[760px] lg:max-h-[700px]"
                        >
                            {showCalendlyLoader && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fafafa]">
                                    <CalendlyLoader />
                                </div>
                            )}

                            <InlineWidget
                                url={calendlyUrl}
                                pageSettings={{
                                    ...CALENDLY_PAGE_SETTINGS,
                                    hideEventTypeDetails: true,
                                }}
                                iframeTitle="Schedule a discovery call with Bonotech"
                                LoadingSpinner={CalendlyLoader}
                                styles={{
                                    ...widgetStyles,
                                    backgroundColor: '#fafafa',
                                    padding: 0,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
