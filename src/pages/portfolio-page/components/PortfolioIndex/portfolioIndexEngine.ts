// In-page navigation only: no scroll interception or section snapping.
export function currentPortfolioIndex(bounds: { top: number; bottom: number }[], readingLine: number) {
    return bounds.findIndex(({ top, bottom }) => top <= readingLine && bottom > readingLine)
}

/** Wires the floating index; stays hidden (returns null) unless every linked section exists. */
export function initPortfolioIndex(root: HTMLElement): (() => void) | null {
    const toggle = root.querySelector<HTMLButtonElement>('.pi-toggle')
    const panel = root.querySelector<HTMLElement>('.pi-panel')
    if (!toggle || !panel) return null
    const links = [...panel.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    const sections = links.map((link) => document.getElementById(link.hash.slice(1)))
    if (sections.some((section) => !section)) return null
    const targets = sections as HTMLElement[]
    const dots = [...root.querySelectorAll<HTMLElement>('.pi-rail i')]
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let pinned = false
    let hovering = false
    let suppressed = false
    let frame = 0

    function renderOpen() {
        const open = !suppressed && (pinned || hovering || panel!.contains(document.activeElement))
        panel!.hidden = !open
        root.dataset.open = String(open)
        toggle!.setAttribute('aria-expanded', String(open))
        toggle!.setAttribute('aria-label', open ? 'Close portfolio projects' : 'Explore portfolio projects')
    }
    function close(restoreFocus = false) {
        pinned = false
        hovering = false
        suppressed = true
        if (restoreFocus) toggle!.focus({ preventScroll: true })
        renderOpen()
    }
    const onRootEnter = (event: PointerEvent) => {
        if (!fine.matches || event.pointerType === 'touch') return
        suppressed = false
        hovering = true
        renderOpen()
    }
    const onRootLeave = () => {
        hovering = false
        suppressed = false
        renderOpen()
    }
    const onToggleClick = (event: MouseEvent) => {
        if (pinned) {
            close()
            return
        }
        suppressed = false
        pinned = true
        renderOpen()
        if (event.detail === 0) (links.find((link) => link.hasAttribute('aria-current')) || links[0]).focus()
    }
    const onRootKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            event.preventDefault()
            close(true)
            return
        }
        if (event.target === toggle && event.key === 'ArrowDown') {
            event.preventDefault()
            pinned = true
            suppressed = false
            renderOpen()
            links[0].focus()
        }
    }
    const onFocusOut = (event: FocusEvent) => {
        if (!root.contains(event.relatedTarget as Node | null)) close()
    }
    const onDocumentPointerDown = (event: PointerEvent) => {
        if (!root.contains(event.target as Node)) close()
    }
    const linkHandlers = links.map((link, index) => {
        const onClick = (event: MouseEvent) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            close()
            const section = targets[index]
            const heading = document.getElementById(section.getAttribute('aria-labelledby') ?? '') || section
            heading.setAttribute('tabindex', '-1')
            heading.focus({ preventScroll: true })
            history.pushState(null, '', link.hash)
            section.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' })
            scheduleCurrent()
        }
        const onKeyDown = (event: KeyboardEvent) => {
            const destinations: Record<string, number> = {
                ArrowDown: (index + 1) % links.length,
                ArrowUp: (index + links.length - 1) % links.length,
                Home: 0,
                End: links.length - 1,
            }
            if (!(event.key in destinations)) return
            event.preventDefault()
            links[destinations[event.key]].focus()
        }
        link.addEventListener('click', onClick)
        link.addEventListener('keydown', onKeyDown)
        return { link, onClick, onKeyDown }
    })
    function markCurrent() {
        frame = 0
        const readingLine = Math.min(window.innerHeight * 0.38, 320)
        const current = currentPortfolioIndex(
            targets.map((section) => section.getBoundingClientRect()),
            readingLine,
        )
        links.forEach((link, index) => {
            if (index === current) link.setAttribute('aria-current', 'location')
            else link.removeAttribute('aria-current')
            dots[index]?.classList.toggle('is-current', index === current)
        })
    }
    function scheduleCurrent() {
        if (!frame) frame = requestAnimationFrame(markCurrent)
    }
    const onFineChange = () => close()

    root.addEventListener('pointerenter', onRootEnter)
    root.addEventListener('pointerleave', onRootLeave)
    toggle.addEventListener('click', onToggleClick)
    root.addEventListener('keydown', onRootKeyDown)
    root.addEventListener('focusout', onFocusOut)
    document.addEventListener('pointerdown', onDocumentPointerDown, { passive: true })
    window.addEventListener('scroll', scheduleCurrent, { passive: true })
    window.addEventListener('resize', scheduleCurrent, { passive: true })
    fine.addEventListener('change', onFineChange)
    document.fonts.ready.then(scheduleCurrent)
    root.hidden = false
    renderOpen()
    markCurrent()

    return () => {
        cancelAnimationFrame(frame)
        frame = 0
        root.removeEventListener('pointerenter', onRootEnter)
        root.removeEventListener('pointerleave', onRootLeave)
        toggle.removeEventListener('click', onToggleClick)
        root.removeEventListener('keydown', onRootKeyDown)
        root.removeEventListener('focusout', onFocusOut)
        document.removeEventListener('pointerdown', onDocumentPointerDown)
        window.removeEventListener('scroll', scheduleCurrent)
        window.removeEventListener('resize', scheduleCurrent)
        fine.removeEventListener('change', onFineChange)
        linkHandlers.forEach(({ link, onClick, onKeyDown }) => {
            link.removeEventListener('click', onClick)
            link.removeEventListener('keydown', onKeyDown)
        })
        root.hidden = true
        panel.hidden = true
    }
}
