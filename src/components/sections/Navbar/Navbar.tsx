import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import bonotechLogo from '@/assets/bonotech-logo-mono.png'
import menuIcon from '@/assets/icons/menu-line-horizontal.svg'
import type { NavbarProps, NavLink } from './Navbar.types'

const DEFAULT_LINKS: NavLink[] = [
    { label: 'About', href: '#what-we-do' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'FAQs', href: '#faq' },
]

export function Navbar({ links = DEFAULT_LINKS }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === '/'

    // From terms/privacy pages, nav links must go to homepage with hash so the section scroll works
    const navHref = (hashLink: string) => (isHome ? hashLink : `/${hashLink}`)

    const closeMenu = () => setMobileMenuOpen(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        // Check initial scroll position
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
                            ? "bg-[#020914]/80 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                            : "bg-transparent border-transparent"
                        : "bg-[#020914]/80 backdrop-blur-md border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
                )}
                aria-label="Main navigation"
            >
                <div
                    className={cn(
                        "mx-auto flex w-full max-w-[1200px] items-center justify-between px-0 max-xl:px-6 transition-all duration-300 ease-in-out",
                        isScrolled ? "h-[80px]" : "h-[104px]"
                    )}
                >
                    <a href="/" className="shrink-0 relative z-[60]" aria-label="Bonotech Home">
                        <img
                            src={bonotechLogo}
                            alt="Bonotech"
                            className="h-10 w-auto"
                        />
                    </a>

                    <div className="hidden lg:flex items-center gap-10">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={navHref(link.href)}
                                className="text-[17px] font-semibold leading-[1.4] text-white transition-colors duration-200 hover:text-white/75"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <a
                        href={navHref('#contact')}
                        className={cn(
                            "group hidden h-[49px] items-center gap-3 rounded-full py-[6px] pl-[25px] pr-[7px] text-[17px] font-semibold leading-[1.4] text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] lg:inline-flex",
                            isScrolled ? "bg-white/10 hover:bg-white/20" : "bg-white/13 hover:bg-white/20"
                        )}
                    >
                        Contact Us
                        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-0.5">
                            <ArrowRight className="h-[16px] w-[16px] text-[#131314] transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className="relative z-[60] p-2 text-white lg:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-expanded={mobileMenuOpen}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        <span
                            className={cn(
                                'absolute inset-2 flex items-center justify-center transition-all duration-300',
                                mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
                            )}
                        >
                            <X className="w-6 h-6 text-white" />
                        </span>
                        <span
                            className={cn(
                                'flex items-center justify-center transition-all duration-300',
                                mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                            )}
                        >
                            <img src={menuIcon} alt="" aria-hidden="true" className="w-6 h-6" />
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
                                href={navHref(link.href)}
                                onClick={closeMenu}
                                className="text-white/90 font-semibold text-center hover:text-white transition-colors duration-200"
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
                            href={navHref('#contact')}
                            onClick={closeMenu}
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
