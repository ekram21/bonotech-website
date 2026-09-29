/** Matches `--navbar-scroll-offset` / `scroll-padding-top` on `html` in globals.css */
const SCROLL_PADDING_TOP = 96

/** How long a typical smooth window.scrollTo takes before we optionally nudge. */
const SMOOTH_SETTLE_MS = 700

type ScrollAlign = 'start' | 'center'

const SECTION_SCROLL_ALIGN: Partial<Record<string, ScrollAlign>> = {
    introduction: 'center',
    schedule: 'center',
    'what-we-do': 'center',
    faq: 'center',
}

function prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getScrollTop(el: HTMLElement, align: ScrollAlign) {
    const elementTop = el.getBoundingClientRect().top + window.scrollY
    const elementHeight = el.offsetHeight
    const viewportHeight = window.innerHeight
    const maxScrollTop = document.documentElement.scrollHeight - viewportHeight

    if (align === 'start') {
        return Math.min(Math.max(0, elementTop - SCROLL_PADDING_TOP), maxScrollTop)
    }

    const centeredTop = elementTop + elementHeight / 2 - viewportHeight / 2

    if (elementHeight <= viewportHeight) {
        return Math.max(0, Math.min(centeredTop, maxScrollTop))
    }

    const minTop = elementTop - SCROLL_PADDING_TOP
    const maxTop = Math.min(elementTop + elementHeight - viewportHeight, maxScrollTop)

    return Math.max(minTop, Math.min(centeredTop, maxTop))
}

function scrollToElement(id: string, behavior: ScrollBehavior, align: ScrollAlign = 'start') {
    const el = document.getElementById(id)
    if (!el) return false

    window.scrollTo({ top: getScrollTop(el, align), behavior })
    return true
}

let settleTimer: number | undefined

/**
 * Scroll to a page section by id. Uses smooth scrolling for in-page nav
 * (unless the user prefers reduced motion).
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
    const el = document.getElementById(id)
    if (!el) return

    const align = SECTION_SCROLL_ALIGN[id] ?? 'start'
    const useSmooth = behavior === 'smooth' && !prefersReducedMotion()
    const resolvedBehavior: ScrollBehavior = useSmooth ? 'smooth' : 'auto'

    if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer)
        settleTimer = undefined
    }

    scrollToElement(id, resolvedBehavior, align)

    // After a smooth scroll finishes, nudge once if layout shifted — without
    // interrupting the animation with an immediate jump.
    if (useSmooth) {
        settleTimer = window.setTimeout(() => {
            const target = document.getElementById(id)
            if (!target) return
            const intended = getScrollTop(target, align)
            if (Math.abs(window.scrollY - intended) > 8) {
                window.scrollTo({ top: intended, behavior: 'auto' })
            }
            settleTimer = undefined
        }, SMOOTH_SETTLE_MS)
    }
}

/** Intercept in-page hash links so layout-settle re-scroll runs. */
export function handleHashLinkClick(
    event: { preventDefault: () => void },
    href: string,
): boolean {
    if (!href.startsWith('#')) return false

    const id = href.slice(1)
    if (!document.getElementById(id)) return false

    event.preventDefault()
    scrollToSection(id, 'smooth')
    window.history.pushState(null, '', href)
    return true
}

/** Honor `#section` on first paint / hard refresh (instant, no animation). */
export function scrollToHashOnLoad() {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return

    const id = decodeURIComponent(hash.slice(1))
    if (!document.getElementById(id)) return

    scrollToSection(id, 'auto')
}
