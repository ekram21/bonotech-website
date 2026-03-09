import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import bonotechLogo from '@/assets/bonotech-logo.png'
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
    const location = useLocation()
    const isHome = location.pathname === '/'

    // From terms/privacy pages, nav links must go to homepage with hash so the section scroll works
    const navHref = (hashLink: string) => (isHome ? hashLink : `/${hashLink}`)

    const closeMenu = () => setMobileMenuOpen(false)

    return (
        <>
            <nav className="sticky top-0 z-[60] w-full bg-surface-white" aria-label="Main navigation">
                <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex items-center justify-between h-[80px]">
                    {/* Logo */}
                    <a href="/" className="shrink-0 relative z-[60]" aria-label="Bonotech Home">
                        <img
                            src={bonotechLogo}
                            alt="Bonotech"
                            className="h-10 w-auto"
                        />
                    </a>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-10">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={navHref(link.href)}
                                className="text-body-lg text-content-primary font-medium hover:text-content-tertiary transition-(--transition-base)"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA Button */}
                    <a
                        href={navHref('#contact')}
                        className="hidden lg:inline-flex items-center gap-3 bg-content-primary text-content-white rounded-full pl-[24px] pr-[6px] py-[6px] text-label-lg hover:opacity-90 transition-(--transition-base)"
                    >
                        Contact Us
                        <span className="w-[36px] h-[36px] rounded-full bg-surface-white flex items-center justify-center">
                            <ArrowRight className="w-[16px] h-[16px] text-content-primary" />
                        </span>
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className="lg:hidden relative z-[60] p-2 text-content-primary"
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
                            <X className="w-6 h-6 text-content-primary" />
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
                    backgroundColor: '#FFFFFF',
                    clipPath: mobileMenuOpen
                        ? 'circle(150% at calc(100% - 40px) 40px)'
                        : 'circle(0px at calc(100% - 40px) 40px)',
                    transition: 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                }}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="mx-auto w-full max-w-(--width-container) px-(--spacing-container-x) flex flex-col items-center justify-between h-full pt-[80px] pb-10">
                    {/* Nav Links — centered, no separators */}
                    <nav className="flex flex-col items-center justify-center gap-8 flex-1">
                        {links.map((link, i) => (
                            <a
                                key={link.label}
                                href={navHref(link.href)}
                                onClick={closeMenu}
                                className="text-[#131314] font-semibold text-center hover:opacity-50 transition-opacity duration-200"
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
                            className="inline-flex items-center gap-3 bg-[#131314] text-white rounded-full pl-[24px] pr-[6px] py-[6px] text-label-lg hover:opacity-90 transition-(--transition-base)"
                        >
                            Contact Us
                            <span className="w-[36px] h-[36px] rounded-full bg-white flex items-center justify-center">
                                <ArrowRight className="w-[16px] h-[16px] text-[#131314]" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
