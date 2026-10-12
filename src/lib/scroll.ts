/**
 * In-page navigation matches the static site: no scroll interception.
 * `scroll-behavior: smooth` and `scroll-padding-top` on `html` do the work.
 */

/** How long a hash target stays pinned after load while images and sections above it settle. */
const SETTLE_MS = 1800
const READER_INPUT = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const

let releaseHold: (() => void) | null = null

function hashTarget(): HTMLElement | null {
    const hash = window.location.hash
    if (hash.length < 2) return null
    return document.getElementById(decodeURIComponent(hash.slice(1)))
}

/** Honor `#section` once layout is ready (instant, same as a document load). */
export function scrollToHashOnLoad() {
    hashTarget()?.scrollIntoView({ behavior: 'instant', block: 'start' })
}

/**
 * Jump to `#section` and keep it in place while content above it is still changing height,
 * so a shared deep link lands once instead of drifting. Lets go as soon as the reader scrolls.
 */
export function holdHashTarget(durationMs = SETTLE_MS) {
    releaseHold?.()
    const target = hashTarget()
    if (!target) return

    const align = () => target.scrollIntoView({ behavior: 'instant', block: 'start' })
    const observer = new ResizeObserver(align)
    const timer = window.setTimeout(release, durationMs)

    function release() {
        observer.disconnect()
        window.clearTimeout(timer)
        READER_INPUT.forEach((type) => window.removeEventListener(type, release))
        if (releaseHold === release) releaseHold = null
    }

    align()
    observer.observe(document.body)
    READER_INPUT.forEach((type) => window.addEventListener(type, release, { passive: true }))
    releaseHold = release
}
