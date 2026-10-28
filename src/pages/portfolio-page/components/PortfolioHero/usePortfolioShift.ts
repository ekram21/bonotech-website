import { useEffect, type RefObject } from 'react'

/** Press feedback and section navigation for the portfolio hero's Shift key. */
export function usePortfolioShift(ref: RefObject<HTMLAnchorElement | null>) {
    useEffect(() => {
        const key = ref.current
        const image = key?.querySelector('img')
        if (!key || !image) return

        const reduced = matchMedia('(prefers-reduced-motion: reduce)')
        const neutral = { transform: 'translateY(0) scale(1)', filter: 'brightness(1)' }
        const raised = { transform: 'translateY(-3px) scale(1)', filter: 'brightness(1.08)' }
        const depressed = { transform: 'translateY(4px) scale(98)', filter: 'brightness(1.06)' }
        let motion: Animation | null = null
        let press: Animation | null = null
        let hovered = false
        let held = false

        const restPose = () => hovered || key.matches(':focus-visible') ? raised : neutral
        const animateTo = (frames: Keyframe[], duration: number) => {
            const style = getComputedStyle(image)
            const current = { transform: style.transform, filter: style.filter, offset: 0 }
            motion?.cancel()
            motion = null
            if (reduced.matches || !image.animate) return null
            motion = image.animate([current, ...frames], {
                duration,
                easing: 'cubic-bezier(.22,1,.36,1)',
                fill: 'forwards',
            })
            return motion
        }
        const settle = () => { if (!press && !held) animateTo([{ ...restPose(), offset: 1 }], 220) }
        const followLink = () => {
            const destination = document.getElementById('highlighted-projects')
            if (!destination) return
            if (location.hash !== key.hash) history.pushState(null, '', key.hash)
            destination.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' })
            const heading = destination.querySelector('h2')
            heading?.setAttribute('tabindex', '-1')
            heading?.focus({ preventScroll: true })
        }
        const onEnter = (event: PointerEvent) => {
            if (event.pointerType === 'mouse' || event.pointerType === 'pen') { hovered = true; settle() }
        }
        const onLeave = () => { hovered = false; held = false; settle() }
        const onDown = (event: PointerEvent) => {
            if (event.button !== 0 || press) return
            held = true
            animateTo([{ ...depressed, offset: 1 }], 110)
        }
        const onCancel = () => { held = false; settle() }
        const onClick = (event: MouseEvent) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            if (press) return
            held = false
            const animation = animateTo([
                { ...depressed, offset: .25 },
                { ...restPose(), offset: 1 },
            ], 300)
            if (!animation) { followLink(); return }
            press = animation
            animation.finished.then(() => {
                if (press !== animation) return
                press = null
                followLink()
                settle()
            }).catch(() => {})
        }
        const onReduced = () => {
            if (!reduced.matches) return
            if (press) press.finish()
            else { motion?.cancel(); motion = null }
        }

        key.addEventListener('pointerenter', onEnter)
        key.addEventListener('pointerleave', onLeave)
        key.addEventListener('pointerdown', onDown)
        key.addEventListener('pointercancel', onCancel)
        key.addEventListener('dragend', onCancel)
        key.addEventListener('focus', settle)
        key.addEventListener('blur', onCancel)
        key.addEventListener('click', onClick)
        reduced.addEventListener('change', onReduced)
        if (!reduced.matches && image.animate) {
            motion = image.animate([
                { ...neutral, offset: 0 }, { ...neutral, offset: .08 },
                { ...depressed, offset: .14 }, { ...neutral, offset: .23 },
                { ...neutral, offset: 1 },
            ], { duration: 7000, delay: 1800, iterations: 2, easing: 'ease-in-out', fill: 'forwards' })
        }
        return () => {
            key.removeEventListener('pointerenter', onEnter)
            key.removeEventListener('pointerleave', onLeave)
            key.removeEventListener('pointerdown', onDown)
            key.removeEventListener('pointercancel', onCancel)
            key.removeEventListener('dragend', onCancel)
            key.removeEventListener('focus', settle)
            key.removeEventListener('blur', onCancel)
            key.removeEventListener('click', onClick)
            reduced.removeEventListener('change', onReduced)
            motion?.cancel()
            press?.cancel()
        }
    }, [ref])
}
