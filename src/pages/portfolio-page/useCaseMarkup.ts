import { useLayoutEffect, type RefObject } from 'react'

/**
 * Case studies render the handover's static markup verbatim and drive it with a ported
 * DOM engine. Markup is injected before paint and reset on cleanup so remounts start clean.
 */
export function useCaseMarkup(
    ref: RefObject<HTMLElement | null>,
    html: string,
    init: (root: HTMLElement) => () => void,
) {
    useLayoutEffect(() => {
        const root = ref.current
        if (!root) return
        root.innerHTML = html
        const destroy = init(root)
        return () => {
            destroy()
            root.innerHTML = ''
        }
    }, [ref, html, init])
}

/** Points handover-relative asset paths at bundled URLs. */
export function resolveAssets(html: string, assets: Record<string, string>) {
    return Object.entries(assets).reduce((markup, [path, url]) => markup.replaceAll(`"${path}"`, `"${url}"`), html)
}
