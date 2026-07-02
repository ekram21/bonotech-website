import { useEffect, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import { Mail, Phone, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SchedulingProps } from './Scheduling.types'

const DEFAULT_CALENDLY_URL =
    import.meta.env.VITE_CALENDLY_URL ?? 'https://calendly.com/shahedantu/30min'

const MOBILE_BREAKPOINT = 1024
const MOBILE_WIDGET_HEIGHT = 760
const DESKTOP_WIDGET_HEIGHT = 700
const DESKTOP_WIDGET_WIDTH = 1000

const CALENDLY_PAGE_SETTINGS = {
    backgroundColor: 'fafafa',
    hideLandingPageDetails: true,
    primaryColor: '8269CF',
    textColor: '272829',
    hideGdprBanner: false,
} as const

export function Scheduling({ className, calendlyUrl = DEFAULT_CALENDLY_URL }: SchedulingProps) {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <section
            id="schedule"
            aria-labelledby="schedule-heading"
            className={cn('w-full bg-[#fafafa] py-20 md:py-28', className)}
        >
            <div className="relative mx-auto w-full max-w-[1600px] px-(--spacing-container-x)">
                <div className="flex flex-col lg:flex-row lg:center gap-12 lg:gap-10 xl:gap-14 w-full">
                    {/* ─── Left Content ─── */}
                    <div className="w-full lg:w-[340px] xl:w-[480px] lg:shrink-0 flex flex-col gap-12 lg:justify-between lg:min-h-[500px] py-16">
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
                                    href="tel:+6565156515"
                                    className="font-body text-[16px] text-[#272829] hover:underline"
                                >
                                    +6565156515
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
                    <div className="w-full lg:flex-1 lg:min-w-0">
                        {/* <div
                            className={cn(
                                'w-full overflow-hidden rounded-[24px] border border-[#E8E9EB] bg-white',
                                'shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
                            )}
                        > */}
                            <InlineWidget
                                url={calendlyUrl}
                                pageSettings={{
                                    ...CALENDLY_PAGE_SETTINGS,
                                    hideEventTypeDetails: isMobile,
                                }}
                                iframeTitle="Schedule a discovery call with Bonotech"
                                styles={{
                                    height: `${isMobile ? MOBILE_WIDGET_HEIGHT : DESKTOP_WIDGET_HEIGHT}px`,
                                    width: '100%',
                                    minWidth: '100%',
                                    maxWidth: `${DESKTOP_WIDGET_WIDTH}px`,
                                    backgroundColor: '#fafafa',
                                }}
                            />
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </section>
    )
}
