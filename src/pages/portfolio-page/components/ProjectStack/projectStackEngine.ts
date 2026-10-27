// Interaction adapted from moazamtrade's Stacked Panels on 21st.dev.
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

type PoseKey = 'height' | 'y' | 'z' | 'x'
type Pose = Record<PoseKey, number> & { shade: number }
const POSE_KEYS: PoseKey[] = ['height', 'y', 'z', 'x']

export function panelPose(
    index: number,
    active: number,
    { compact = false, engaged = false, count = 6 } = {},
): Pose {
    const selected = clamp(Number.isFinite(active) ? active : 0, 0, count - 1)
    if (compact) {
        const depth = (index - Math.round(selected) + count) % count
        return { height: 310 - depth * 4, y: 0, z: -depth * 28, x: depth * 10, shade: depth * 0.04 }
    }
    const distance = index - selected
    const influence = Math.exp(-(distance * distance) / (2 * 0.55 * 0.55))
    return {
        height: (370 - index * 5) * (engaged ? 0.46 + 0.54 * influence : 1),
        y: engaged ? -influence * Math.min(95, 30 + index * 35) : 0,
        z: -index * 115,
        x: 0,
        shade: index * 0.022,
    }
}

export type SelectSource = 'click' | 'keyboard' | 'swipe'

export interface ProjectStackEngine {
    select: (index: number, source: SelectSource) => void
    destroy: () => void
}

interface Elements {
    stage: HTMLElement
    scene: HTMLElement
    cards: HTMLElement[]
    buttons: HTMLButtonElement[]
}

export function createProjectStack(
    { stage, scene, cards, buttons }: Elements,
    onSelect: (index: number) => void,
): ProjectStackEngine {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compact = window.matchMedia('(max-width: 640px)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    let current = 0
    let selected = 0
    let engaged = true
    let visible = false
    let frame = 0
    let last = 0
    let stageWidth = 0
    let targetX = 12
    let targetY = -43
    let rotationX = 12
    let rotationY = -43
    let vx = 0
    let vy = 0
    let hoverAnchor: { x: number; y: number } | null = null
    const poses = cards.map((_, i) => ({ ...panelPose(i, 0), velocity: { height: 0, y: 0, z: 0, x: 0 } }))
    let highlighted = -1

    function highlight(index: number) {
        const active = clamp(Math.round(index), 0, cards.length - 1)
        if (highlighted === active) return
        highlighted = active
        cards.forEach((card, i) => { card.dataset.active = String(i === active) })
        buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)))
    }

    function select(index: number, source: SelectSource) {
        selected = clamp(index, 0, cards.length - 1)
        current = selected
        engaged = true
        hoverAnchor = null
        highlight(selected)
        onSelect(selected)
        if (source === 'keyboard') buttons[selected]?.focus()
        paint(performance.now(), true)
        start()
    }
    function spring(value: number, velocity: number, target: number, dt: number) {
        const nextVelocity = velocity + ((target - value) * 160 - velocity * 28) * dt
        return [value + nextVelocity * dt, nextVelocity]
    }
    function paint(now: number, immediate = false) {
        const dt = clamp((now - last) / 1000 || 1 / 60, 0.001, 1 / 30)
        last = now
        const small = compact.matches
        const rx = small ? 7 : targetX
        const ry = small ? -14 : targetY
        ;[rotationX, vx] = immediate ? [rx, 0] : spring(rotationX, vx, rx, dt)
        ;[rotationY, vy] = immediate ? [ry, 0] : spring(rotationY, vy, ry, dt)
        let unsettled =
            Math.abs(rotationX - rx) + Math.abs(rotationY - ry) + Math.abs(vx) + Math.abs(vy) > 0.03
        const scale = small ? Math.min(1, stageWidth / 340) : Math.min(1, stageWidth / 720)
        scene.style.transform = `scale(${scale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
        scene.style.left = small ? 'calc(50% - 24px)' : `calc(50% - ${195 * scale}px)`
        cards.forEach((card, i) => {
            const target = panelPose(i, current, { compact: small, engaged, count: cards.length })
            const pose = poses[i]
            for (const key of POSE_KEYS) {
                ;[pose[key], pose.velocity[key]] = immediate
                    ? [target[key], 0]
                    : spring(pose[key], pose.velocity[key], target[key], dt)
                if (Math.abs(pose[key] - target[key]) + Math.abs(pose.velocity[key]) > 0.05) unsettled = true
            }
            card.style.height = `${pose.height}px`
            card.style.transform = `translate3d(${pose.x}px,${pose.y}px,${pose.z}px)`
        })
        frame = 0
        if (unsettled && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(paint)
    }
    function stop() {
        cancelAnimationFrame(frame)
        frame = 0
        last = 0
    }
    function start() {
        if (reduced.matches) {
            stop()
            paint(performance.now(), true)
            return
        }
        if (!frame && visible && !document.hidden) frame = requestAnimationFrame(paint)
    }
    function reset() {
        current = selected
        targetX = 12
        targetY = -43
        hoverAnchor = null
        highlight(selected)
        onSelect(selected)
        start()
    }

    const onPointerMove = (event: PointerEvent) => {
        if (!fine.matches || compact.matches || reduced.matches || event.pointerType === 'touch') return
        const rect = stage.getBoundingClientRect()
        const hoveredCard = (event.target as Element | null)?.closest('.ps-panel')
        const candidate = cards.indexOf(hoveredCard as HTMLElement)
        let next = current
        if (candidate >= 0) {
            if (
                !hoverAnchor ||
                (candidate !== current &&
                    Math.hypot(event.clientX - hoverAnchor.x, event.clientY - hoverAnchor.y) >= 12)
            ) {
                hoverAnchor = { x: event.clientX, y: event.clientY }
                next = candidate
            }
        }
        if (next !== current) {
            current = next
            highlight(current)
            onSelect(current)
        }
        engaged = true
        const scale = Math.min(1, stageWidth / 720)
        const trackWidth = 610 * scale
        const x = clamp((event.clientX - rect.left - (stageWidth - trackWidth) / 2) / trackWidth, 0, 1)
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
        targetX = 12 + (y - 0.5) * -7
        targetY = -43 + (x - 0.5) * 10
        start()
    }
    let touchStart: { x: number; y: number } | null = null
    const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY }
    }
    const onPointerUp = (event: PointerEvent) => {
        if (!touchStart) return
        const dx = event.clientX - touchStart.x
        const dy = event.clientY - touchStart.y
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            select((selected + (dx < 0 ? 1 : -1) + cards.length) % cards.length, 'swipe')
        }
        touchStart = null
    }
    const onPointerCancel = () => {
        touchStart = null
    }
    function measure() {
        stageWidth = stage.clientWidth
        stop()
        paint(performance.now(), true)
    }
    const onVisibility = () => {
        if (document.hidden) stop()
        else start()
    }

    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerleave', reset)
    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerCancel)
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)
    const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
            else stop()
        },
        { threshold: 0.05 },
    )
    intersectionObserver.observe(stage)
    document.addEventListener('visibilitychange', onVisibility)
    reduced.addEventListener('change', measure)
    compact.addEventListener('change', measure)
    measure()
    highlight(0)

    return {
        select,
        destroy() {
            stop()
            stage.removeEventListener('pointermove', onPointerMove)
            stage.removeEventListener('pointerleave', reset)
            stage.removeEventListener('pointerdown', onPointerDown)
            stage.removeEventListener('pointerup', onPointerUp)
            stage.removeEventListener('pointercancel', onPointerCancel)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            document.removeEventListener('visibilitychange', onVisibility)
            reduced.removeEventListener('change', measure)
            compact.removeEventListener('change', measure)
        },
    }
}
