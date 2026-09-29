import { useState, useEffect, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { trackCtaClick } from '@/lib/analytics'
import { handleHashLinkClick } from '@/lib/scroll'
import { cn } from '@/lib/utils'
import bonotechLogo from '@/assets/bonotech-logo-white.svg'
import menuIcon from '@/assets/icons/menu_bars_icon.svg'

export interface NavLink {
    label: string
    href: string
    /** When set, the link downloads a file instead of navigating */
    download?: string | boolean
}

export interface NavbarProps {
    /** Optional custom navigation links */
    links?: NavLink[]
}


const DEFAULT_LINKS: NavLink[] = [
    { label: 'Service Scopes', href: '#ways-in' },
    { label: 'Clients', href: '#our-clients' },
    { label: 'Testimonials', href: '#client-testimonials' },
    {
        label: 'Download Portfolio',
        href: '/Bonotech-Portfolio.pdf',
        download: 'Bonotech-Portfolio-V3.pdf',
    },
]

export function Navbar({ links = DEFAULT_LINKS }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === '/'

    // From terms/privacy pages, nav links must go to homepage with hash so the section scroll works
    const navHref = (hashLink: string) => (isHome ? hashLink : `/${hashLink}`)

    const closeMenu = () => setMobileMenuOpen(false)

    const handleNavLinkClick = (
        event: MouseEvent<HTMLAnchorElement>,
        link: NavLink,
    ) => {
        if (link.download) {
            closeMenu()
            return
        }
        if (!isHome || !link.href.startsWith('#')) return
        handleHashLinkClick(event, link.href)
        closeMenu()
    }

    const resolveHref = (link: NavLink) =>
        link.download ? link.href : navHref(link.href)

    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                setIsScrolled(window.scrollY > 20)
                ticking = false
            })
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-[60] w-full transition-all duration-300 ease-in-out border-b",
                    isHome
                        ? isScrolled
                            ? "border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-[#020914]/75 backdrop-blur-sm max-lg:bg-[rgba(2,9,20,0.72)] max-lg:backdrop-blur-[6px] max-lg:shadow-none"
                            : "bg-transparent border-transparent"
                        : "border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-[#020914]/75 backdrop-blur-sm max-lg:bg-[rgba(2,9,20,0.72)] max-lg:backdrop-blur-[6px] max-lg:shadow-none"
                )}
                aria-label="Main navigation"
            >
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-[1200px] items-center justify-between px-0 max-xl:px-6 transition-all duration-300 ease-in-out",
                        isScrolled ? "h-[80px]" : "h-[104px]"
                    )}
                >
                    <a
                        href="/"
                        className="relative z-[60] flex h-[49px] w-auto max-w-[150px] shrink-0 items-center sm:max-w-[170px] lg:max-w-[190px]"
                        aria-label="Bonotech Home"
                    >
                        <img
                            src={bonotechLogo}
                            alt="Bonotech"
                            className="block h-[22px] w-auto object-contain object-left sm:h-6 lg:h-[26px]"
                        />
                    </a>

                    <div className="hidden lg:flex h-[49px] items-center gap-5">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={resolveHref(link)}
                                download={link.download || undefined}
                                onClick={(event) => handleNavLinkClick(event, link)}
                                className="flex h-full items-center px-3 text-[17px] font-medium leading-none text-white transition-colors duration-200 hover:text-white/75"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden max-w-[225px] shrink-0 justify-end lg:flex">
                        <a
                            href={navHref('#discovery-call')}
                            onClick={(event) => {
                                trackCtaClick('nav_contact_us')
                                handleNavLinkClick(event, {
                                    label: 'Contact Us',
                                    href: '#discovery-call',
                                })
                            }}
                            className={cn(
                                "group inline-flex h-[49px] items-center gap-3 rounded-full py-[6px] pl-[25px] pr-[7px] text-[17px] font-medium leading-none text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
                                isScrolled ? "bg-white/10 hover:bg-white/20" : "bg-white/13 hover:bg-white/20"
                            )}
                        >
                            Contact Us
                            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-0.5">
                                <ArrowRight className="h-[16px] w-[16px] text-[#131314] transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                        </a>
                    </div>


                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className="relative z-[60] flex h-9 w-9 shrink-0 items-center justify-center text-white sm:h-10 sm:w-10 lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span
                            className={cn(
                                'absolute inset-0 flex items-center justify-center transition-all duration-300',
                                mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                            )}
                        >
                            <X className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </span>
                        <span
                            className={cn(
                                'absolute inset-0 flex items-center justify-center transition-all duration-300',
                                mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                            )}
                        >
                            <img src={menuIcon} alt="" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Full-Screen Overlay — clip-path circle expanding from hamburger */}
            <div
                className="fixed inset-0 z-[55] lg:hidden flex flex-col"
                style={{
                    backgroundColor: '#020914',
                    clipPath: mobileMenuOpen
                        ? 'circle(150% at calc(100% - 40px) 40px)'
                        : 'circle(0px at calc(100% - 40px) 40px)',
                    transition: 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                }}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center justify-between h-full pt-[104px] pb-10">
                    {/* Nav Links — centered, no separators */}
                    <nav className="flex flex-col items-center justify-center gap-8 flex-1">
                        {links.map((link, i) => (
                            <a
                                key={link.label}
                                href={resolveHref(link)}
                                download={link.download || undefined}
                                onClick={(event) => handleNavLinkClick(event, link)}
                                className="text-white/90 font-medium text-center hover:text-white transition-colors duration-200"
                                style={{
                                    fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
                                    lineHeight: 1.15,
                                    opacity: mobileMenuOpen ? 1 : 0,
                                    transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.4s ease ${0.1 + i * 0.07}s`,
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Bottom CTA */}
                    <div
                        style={{
                            opacity: mobileMenuOpen ? 1 : 0,
                            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                            transition: `opacity 0.4s ease ${0.1 + links.length * 0.07}s, transform 0.4s ease ${0.1 + links.length * 0.07}s`,
                        }}
                    >
                        <a
                            href={navHref('#discovery-call')}
                            onClick={(event) => {
                                trackCtaClick('nav_contact_us_mobile')
                                handleNavLinkClick(event, {
                                    label: 'Contact Us',
                                    href: '#discovery-call',
                                })
                            }}
                            className="inline-flex items-center gap-3 bg-white text-[#131314] rounded-full pl-[24px] pr-[6px] py-[6px] text-label-lg hover:bg-white/90 transition-all duration-300"
                        >
                            Contact Us
                            <span className="w-[36px] h-[36px] rounded-full bg-[#131314] flex items-center justify-center">
                                <ArrowRight className="w-[16px] h-[16px] text-white" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
