// Local product walkthrough; all records and results are illustrative. No queries are sent.
export const DITECH_DURATION = 28000
export const DITECH_QUESTION = 'How did sales perform across all beneficiaries last quarter?'
export const DITECH_CHAPTERS = { dashboard: 0, question: 10200, analytics: 14500 }

type Chapter = keyof typeof DITECH_CHAPTERS

const STARTS: Record<Chapter, number> = { dashboard: 0, question: 5000, analytics: 11800 }
const ENDS: Record<Chapter, number> = { dashboard: 5000, question: 11800, analytics: DITECH_DURATION }
const clamp = (n: number) => Math.max(0, Math.min(1, n))

export function ditechStateAt(elapsed: number) {
    const t = Number.isFinite(elapsed) ? Math.max(0, elapsed) % DITECH_DURATION : 0
    const phase = t < 5000 ? 'dashboard' : t < 6200 ? 'focus' : t < 10400 ? 'typing' : t < 11800 ? 'sending' : 'analytics'
    const chapter: Chapter = t < 5000 ? 'dashboard' : t < 11800 ? 'question' : 'analytics'
    return {
        phase,
        chapter,
        record: Math.floor(t / 2400) % 4,
        question: DITECH_QUESTION.slice(0, Math.floor(DITECH_QUESTION.length * clamp((t - 6200) / 3700))),
        progress: (t - STARTS[chapter]) / (ENDS[chapter] - STARTS[chapter]),
    }
}

const CAPTIONS: Record<Chapter, string> = {
    dashboard: 'Separate records become one shared view of leads, opportunities, approvals and follow-ups.',
    question: 'A simple business question draws on the connected CRM, through permission-controlled MCP access.',
    analytics:
        'One question. Sales performance, pipeline coverage and supplier follow-ups, all in the same business context.',
}

export function initDitechDemo(section: HTMLElement): () => void {
    const demo = section.querySelector<HTMLElement>('#ditech-demo')!
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)')
    const chapters = [...demo.querySelectorAll<HTMLButtonElement>('[data-dc-chapter]')]
    const pause = demo.querySelector<HTMLButtonElement>('#dc-pause')!
    const replay = demo.querySelector<HTMLButtonElement>('#dc-replay')!
    const announcement = demo.querySelector<HTMLElement>('#dc-announcement')!
    const question = demo.querySelector<HTMLElement>('#dc-question-text')!
    const helper = demo.querySelector<HTMLElement>('#dc-question-helper')!
    const dashboard = demo.querySelector<HTMLElement>('#dc-dashboard')!
    const query = demo.querySelector<HTMLElement>('#dc-question')!
    const analytics = demo.querySelector<HTMLElement>('#dc-analytics')!
    const intro = demo.querySelector<HTMLElement>('.dc-question-intro')!
    const screenName = demo.querySelector<HTMLElement>('#dc-screen-name')!
    const caption = demo.querySelector<HTMLElement>('#dc-caption')!
    let elapsed = reduced.matches ? DITECH_CHAPTERS.analytics : 0
    let userPaused = reduced.matches
    let inView = false
    let last: number | null = null
    let frame = 0
    let previousPhase = ''
    let previousChapter = ''
    const setText = (node: HTMLElement, text: string) => {
        if (node.textContent !== text) node.textContent = text
    }

    function paint() {
        const s = ditechStateAt(elapsed)
        demo.dataset.record = String(s.record)
        setText(question, s.question || 'Ask a business question…')
        if (s.phase !== previousPhase) {
            demo.dataset.phase = s.phase
            const result = s.phase === 'analytics'
            analytics.setAttribute('aria-hidden', String(!result))
            dashboard.setAttribute('aria-hidden', String(s.phase !== 'dashboard'))
            query.setAttribute('aria-hidden', String(result))
            intro.setAttribute('aria-hidden', String(s.phase === 'dashboard' || result))
            setText(screenName, result ? 'Executive Analytics' : 'Dashboard')
            setText(
                helper,
                s.phase === 'sending'
                    ? 'Reading approved CRM data…'
                    : 'Sample question · This demonstration types and sends automatically.',
            )
            previousPhase = s.phase
        }
        if (s.chapter !== previousChapter) {
            setText(caption, CAPTIONS[s.chapter])
            chapters.forEach((button) => {
                if (button.dataset.dcChapter === s.chapter) button.setAttribute('aria-current', 'step')
                else button.removeAttribute('aria-current')
            })
            previousChapter = s.chapter
        }
        chapters.forEach((button) =>
            button.style.setProperty('--chapter-progress', String(button.dataset.dcChapter === s.chapter ? s.progress : 0)),
        )
    }
    function syncPlayback() {
        const running = inView && !document.hidden && !userPaused
        demo.dataset.paused = String(!running)
        pause.setAttribute('aria-pressed', String(userPaused))
        const label = (userPaused ? 'Play' : 'Pause') + ' DITECH demonstration'
        pause.setAttribute('aria-label', label)
        pause.title = label
        if (!running) {
            cancelAnimationFrame(frame)
            frame = 0
            last = null
        } else if (!frame) frame = requestAnimationFrame(tick)
    }
    function tick(now: number) {
        frame = 0
        if (last !== null) elapsed = (elapsed + Math.min(Math.max(0, now - last), 150)) % DITECH_DURATION
        last = now
        paint()
        if (inView && !document.hidden && !userPaused) frame = requestAnimationFrame(tick)
    }

    const removers: (() => void)[] = []
    const listen = <K extends keyof HTMLElementEventMap>(
        node: HTMLElement,
        type: K,
        handler: (event: HTMLElementEventMap[K]) => void,
    ) => {
        node.addEventListener(type, handler)
        removers.push(() => node.removeEventListener(type, handler))
    }
    chapters.forEach((button, index) => {
        listen(button, 'click', () => {
            elapsed = DITECH_CHAPTERS[button.dataset.dcChapter as Chapter]
            userPaused = true
            last = null
            paint()
            syncPlayback()
            announcement.textContent = `${button.textContent?.trim()}. Replay paused for inspection.`
        })
        listen(button, 'keydown', (event) => {
            const indices: Record<string, number> = {
                ArrowRight: (index + 1) % chapters.length,
                ArrowLeft: (index - 1 + chapters.length) % chapters.length,
                Home: 0,
                End: chapters.length - 1,
            }
            if (!(event.key in indices)) return
            event.preventDefault()
            const target = chapters[indices[event.key]]
            target.focus()
            target.click()
        })
    })
    listen(pause, 'click', () => {
        userPaused = !userPaused
        last = null
        syncPlayback()
        announcement.textContent = 'DITECH demonstration ' + (userPaused ? 'paused.' : 'playing.')
    })
    listen(replay, 'click', () => {
        elapsed = reduced.matches ? DITECH_CHAPTERS.analytics : 0
        userPaused = reduced.matches
        last = null
        paint()
        syncPlayback()
        announcement.textContent = 'DITECH demonstration restarted.'
    })
    const observer = new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting && entry.intersectionRatio >= 0.2
            syncPlayback()
        },
        { threshold: [0, 0.2] },
    )
    observer.observe(demo.querySelector('.dc-device')!)
    const onReducedChange = () => {
        if (reduced.matches) {
            elapsed = DITECH_CHAPTERS.analytics
            userPaused = true
            paint()
        }
        syncPlayback()
    }
    document.addEventListener('visibilitychange', syncPlayback)
    reduced.addEventListener('change', onReducedChange)
    paint()
    syncPlayback()

    return () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        removers.forEach((remove) => remove())
        document.removeEventListener('visibilitychange', syncPlayback)
        reduced.removeEventListener('change', onReducedChange)
    }
}
