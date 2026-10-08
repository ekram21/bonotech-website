import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { trackCtaClick } from '@/lib/analytics'
import { handleHashLinkClick } from '@/lib/scroll'
import bonotechLogo from '@/assets/bonotech-logo-nav.svg'
import './navbar.css'

export interface NavLink {
    label: string
    href: string
}

export interface NavbarProps {
    /** Optional custom navigation links */
    links?: NavLink[]
}

const COMPACT_QUERY = '(max-width: 940px)'
const DISCOVERY_HREF = '#discovery-call'
/** Pages that render the discovery section, so booking links can stay on the page. */
export const PAGES_WITH_DISCOVERY = new Set(['/', '/portfolio', '/discovery-meeting'])
const DISCOVERY_PAGE = '/discovery-meeting'
/** Distance below the header at which a section counts as the one being read. */
const READING_LINE_OFFSET = 120

const DEFAULT_LINKS: NavLink[] = [
    { label: 'Service Scopes', href: '#ways-in' },
    { label: 'Clients', href: '#our-clients' },
    { label: 'Solutions', href: '#service-tiers' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Testimonials', href: '#client-testimonials' },
]

function useCompactLayout(onChange: (compact: boolean) => void) {
    const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches)
    const onChangeRef = useRef(onChange)

    useEffect(() => {
        onChangeRef.current = onChange
    })

    useEffect(() => {
        const query = window.matchMedia(COMPACT_QUERY)
        const handleChange = () => {
            setCompact(query.matches)
            onChangeRef.current(query.matches)
        }
        query.addEventListener('change', handleChange)
        return () => query.removeEventListener('change', handleChange)
    }, [])

    return compact
}

export function Navbar({ links = DEFAULT_LINKS }: NavbarProps) {
    const location = useLocation()
    const isHome = location.pathname === '/'

    const headerRef = useRef<HTMLElement | null>(null)
    const navigationRef = useRef<HTMLElement | null>(null)
    const toggleRef = useRef<HTMLButtonElement | null>(null)
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

    const [open, setOpen] = useState(false)
    const [currentHref, setCurrentHref] = useState<string | null>(null)

    const compact = useCompactLayout((isCompact) => {
        const focusWillHide =
            isCompact && navigationRef.current?.contains(document.activeElement)
        setOpen(false)
        if (focusWillHide) toggleRef.current?.focus()
    })

    const menuOpen = compact && open

    const isOnPage = (href: string) =>
        isHome || (href === DISCOVERY_HREF && PAGES_WITH_DISCOVERY.has(location.pathname))
    // From other pages, section links go to the homepage with the hash.
    const resolveHref = (href: string) => (isOnPage(href) || !href.startsWith('#') ? href : `/${href}`)

    useEffect(() => {
        if (!menuOpen) return
        const handlePointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('pointerdown', handlePointerDown, { passive: true })
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [menuOpen])

    useEffect(() => {
        if (!isHome) return

        let frame = 0
        const markCurrentSection = () => {
            frame = 0
            const header = headerRef.current
            if (!header) return
            const readingLine = header.getBoundingClientRect().bottom + READING_LINE_OFFSET
            const current = links.find(({ href }) => {
                if (!href.startsWith('#')) return false
                const bounds = document.getElementById(href.slice(1))?.getBoundingClientRect()
                return bounds !== undefined && bounds.top <= readingLine && bounds.bottom > readingLine
            })
            setCurrentHref(current?.href ?? null)
        }
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(markCurrentSection)
        }

        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule, { passive: true })
        schedule()

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
        }
    }, [isHome, links])

    const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
        const wasOpen = menuOpen
        setOpen(false)
        if (!isOnPage(href) || !handleHashLinkClick(event, href)) return

        // Keep keyboard focus in the chosen section after the compact menu collapses.
        if (wasOpen) {
            const target = document.getElementById(href.slice(1))
            target?.setAttribute('tabindex', '-1')
            target?.focus({ preventScroll: true })
        }
    }

    const handleToggleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const opening = !open
        setOpen(opening)
        if (opening && event.detail === 0) {
            requestAnimationFrame(() => firstLinkRef.current?.focus())
        }
    }

    return (
        <>
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>
            <header
                ref={headerRef}
                className="site-header"
                onKeyDown={(event) => {
                    if (event.key === 'Escape' && menuOpen) {
                        event.preventDefault()
                        setOpen(false)
                        toggleRef.current?.focus()
                    }
                }}
                onBlur={(event) => {
                    if (menuOpen && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setOpen(false)
                    }
                }}
            >
                <a
                    className="nav-brand"
                    href={isHome ? '#home' : '/'}
                    aria-label="Bonotech home"
                    onClick={(event) => isHome && handleLinkClick(event, '#home')}
                >
                    <img src={bonotechLogo} alt="Bonotech" width="274" height="43" />
                </a>

                <nav
                    ref={navigationRef}
                    className="site-navigation"
                    id="site-navigation"
                    aria-label="Main navigation"
                    hidden={compact && !open}
                >
                    <ul className="nav-links">
                        {links.map((link, index) => (
                            <li key={link.href}>
                                {link.href.startsWith('#') ? (
                                    <a
                                        ref={index === 0 ? firstLinkRef : undefined}
                                        href={resolveHref(link.href)}
                                        aria-current={currentHref === link.href ? 'location' : undefined}
                                        onClick={(event) => handleLinkClick(event, link.href)}
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        ref={index === 0 ? firstLinkRef : undefined}
                                        to={link.href}
                                        aria-current={location.pathname === link.href ? 'page' : undefined}
                                        onClick={() => setOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <a
                    className="nav-call"
                    href={resolveHref(DISCOVERY_HREF)}
                    aria-current={location.pathname === DISCOVERY_PAGE ? 'page' : undefined}
                    onClick={(event) => {
                        trackCtaClick('nav_book_a_call')
                        handleLinkClick(event, DISCOVERY_HREF)
                    }}
                >
                    <span>Book a Call</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path
                            d="M5 15 15 5M5 5h10v10"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>

                <button
                    ref={toggleRef}
                    className="nav-toggle"
                    type="button"
                    aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
                    aria-expanded={menuOpen}
                    aria-controls="site-navigation"
                    hidden={!compact}
                    onClick={handleToggleClick}
                >
                    <span />
                    <span />
                </button>
            </header>
        </>
    )
}
