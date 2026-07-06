/** Matches `scroll-padding-top` on `html` in globals.css */
const SCROLL_PADDING_TOP = 80

const LAYOUT_SETTLE_DELAYS_MS = [150, 500] as const

function scrollToElement(id: string, behavior: ScrollBehavior) {
    const el = document.getElementById(id)
    if (!el) return false

    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_PADDING_TOP
    window.scrollTo({ top, behavior })
    return true
}

/**
 * Scroll to a page section by id. Re-aligns after short delays so sticky
 * sections (e.g. Projects) that remeasure on mount don't leave the viewport
 * on the wrong block on the first click.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
    if (!scrollToElement(id, behavior)) return

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scrollToElement(id, 'auto')
        })
    })

    for (const delay of LAYOUT_SETTLE_DELAYS_MS) {
        window.setTimeout(() => scrollToElement(id, 'auto'), delay)
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
