/**
 * In-page navigation matches the static site: no scroll interception.
 * `scroll-behavior: smooth` and `scroll-padding-top` on `html` do the work.
 */

/** Honor `#section` once layout is ready (instant, same as a document load). */
export function scrollToHashOnLoad() {
    const hash = window.location.hash
    if (hash.length < 2) return

    const id = decodeURIComponent(hash.slice(1))
    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({ behavior: 'instant', block: 'start' })
}
