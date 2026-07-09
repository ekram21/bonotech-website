/** Matches `scroll-padding-top` on `html` in globals.css */
const SCROLL_PADDING_TOP = 80

const LAYOUT_SETTLE_DELAYS_MS = [150, 500] as const

type ScrollAlign = 'start' | 'center'

const SECTION_SCROLL_ALIGN: Partial<Record<string, ScrollAlign>> = {
    introduction: 'center',
    schedule: 'center',
    'what-we-do': 'center',
    testimonials: 'center',
    faq: 'center',
}

function getScrollTop(el: HTMLElement, align: ScrollAlign) {
    const elementTop = el.getBoundingClientRect().top + window.scrollY
    const elementHeight = el.offsetHeight
    const viewportHeight = window.innerHeight
    const maxScrollTop = document.documentElement.scrollHeight - viewportHeight

    if (align === 'start') {
        return Math.min(elementTop - SCROLL_PADDING_TOP, maxScrollTop)
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

/**
 * Scroll to a page section by id. Re-aligns after short delays so sticky
 * sections (e.g. Projects) that remeasure on mount don't leave the viewport
 * on the wrong block on the first click.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
    const align = SECTION_SCROLL_ALIGN[id] ?? 'start'
    if (!scrollToElement(id, behavior, align)) return

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToElement(id, 'auto', align)
        })
    })

    for (const delay of LAYOUT_SETTLE_DELAYS_MS) {
        window.setTimeout(() => scrollToElement(id, 'auto', align), delay)
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
    scrollToSection(id)
    window.history.pushState(null, '', href)
    return true
}
