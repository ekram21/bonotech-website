// Recreated Gustav towel example. This is a local, time-compressed simulation.
// Source timings: manual 11:02–11:22; digital 11:02–11:06. No messages are sent.
export const GUSTAV_DURATION = 34000
export const GUSTAV_CHAPTERS = { request: 4400, reply: 10000, operations: 18000, result: 27000 }
export const GUSTAV_MESSAGE = 'Could you send two extra towels to Room 203?'

type Chapter = keyof typeof GUSTAV_CHAPTERS

const NOTE = 'Two extra towels, please.'
const STARTS: Record<Chapter, number> = { request: 0, reply: 4500, operations: 11500, result: 23500 }
const ENDS: Record<Chapter, number> = { request: 4500, reply: 11500, operations: 23500, result: GUSTAV_DURATION }
const clamp = (n: number) => Math.max(0, Math.min(1, n))

export function gustavStateAt(elapsed: number) {
    const t = Number.isFinite(elapsed) ? Math.max(0, elapsed) % GUSTAV_DURATION : 0
    const chapter: Chapter = t < 4500 ? 'request' : t < 11500 ? 'reply' : t < 23500 ? 'operations' : 'result'
    const beforeStep = t < 4500 ? 0 : t < 11500 ? 1 : t < 23500 ? 2 : 3
    const sent = t >= 4500
    const replied = t >= 7500
    const expanded = t >= 11500
    const routed = t >= 13000
    const working = t >= 16500
    const delivered = t >= 21000
    return {
        chapter,
        beforeStep,
        before: ['call', 'note', 'radio', 'complete'][beforeStep],
        sent,
        replied,
        expanded,
        routed,
        working,
        delivered,
        typing: sent && !replied,
        message: GUSTAV_MESSAGE.slice(0, Math.floor(GUSTAV_MESSAGE.length * clamp((t - 800) / 3500))),
        writtenNote: NOTE.slice(0, Math.floor(NOTE.length * clamp((t - 5000) / 4000))),
        ticketStatus: delivered ? 'Delivered' : working ? 'In progress' : routed ? 'Assigned' : 'Received',
        progress: (t - STARTS[chapter]) / (ENDS[chapter] - STARTS[chapter]),
    }
}

const CAPTIONS: Record<Chapter, string> = {
    request: 'One guest asks for two towels. A call to reception on the left; a direct message to housekeeping on the right.',
    reply: 'Reception writes a paper note. With Gustav, the housekeeping head replies directly to the guest.',
    operations: 'The chat becomes a tracked task, with the room, request and responsible team already connected.',
    result: 'The same towel request: approximately 20 minutes and 3 manual relays become 4 minutes and 0 manual relays.',
}

export function initGustavDemo(section: HTMLElement): () => void {
    const demo = section.querySelector<HTMLElement>('#gustav-demo')!
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)')
    const chapters = [...section.querySelectorAll<HTMLButtonElement>('[data-gc-chapter]')]
    const viewButtons = [...demo.querySelectorAll<HTMLButtonElement>('[data-gc-view]')]
    const pause = section.querySelector<HTMLButtonElement>('#gc-pause')!
    const replay = section.querySelector<HTMLButtonElement>('#gc-replay')!
    const announcement = section.querySelector<HTMLElement>('#gc-announcement')!
    const beforeScenes = [...demo.querySelectorAll<HTMLElement>('[data-gc-manual]')]
    const beforeSteps = [...demo.querySelectorAll<HTMLElement>('[data-gc-before-step]')]
    const taskSteps = [...demo.querySelectorAll<HTMLElement>('[data-gc-task-step]')]
    const typed = demo.querySelector<HTMLElement>('#gc-typed-message')!
    const written = demo.querySelector<HTMLElement>('#gc-written-note')!
    const guest = demo.querySelector<HTMLElement>('#gc-guest-message')!
    const staff = demo.querySelector<HTMLElement>('#gc-staff-message')!
    const typing = demo.querySelector<HTMLElement>('#gc-chat-typing')!
    const delivered = demo.querySelector<HTMLElement>('#gc-chat-delivered')!
    const byId = (id: string) => demo.querySelector<HTMLElement>(`#${id}`)!
    let elapsed = reduced.matches ? GUSTAV_CHAPTERS.result : 0
    let userPaused = reduced.matches
    let inView = false
    let last: number | null = null
    let frame = 0
    let lastKey = ''
    const setText = (node: HTMLElement, text: string) => {
        if (node.textContent !== text) node.textContent = text
    }

    function paint() {
        const s = gustavStateAt(elapsed)
        setText(typed, s.sent ? 'Message housekeeping…' : s.message || 'Message housekeeping…')
        setText(written, s.writtenNote)
        const key = [s.chapter, s.before, s.sent, s.replied, s.expanded, s.routed, s.working, s.delivered].join(':')
        if (key !== lastKey) {
            demo.dataset.phase = s.chapter
            demo.dataset.before = s.before
            demo.dataset.expanded = String(s.expanded)
            demo.dataset.delivered = String(s.delivered)
            demo.dataset.sent = String(s.sent)
            beforeScenes.forEach((node) => {
                node.hidden = node.dataset.gcManual !== s.before
            })
            beforeSteps.forEach((node, i) => {
                node.classList.toggle('is-current', i === s.beforeStep)
                node.classList.toggle('is-done', i < s.beforeStep)
            })
            setText(byId('gc-before-time'), ['11:02 AM', '11:04 AM', '11:10 AM', '11:22 AM'][s.beforeStep])
            setText(byId('gc-phone-time'), s.delivered ? '11:06' : s.working ? '11:03' : '11:02')
            guest.hidden = !s.sent
            staff.hidden = !s.replied
            typing.hidden = !s.typing
            delivered.hidden = !s.delivered
            byId('gc-operations-intro').setAttribute('aria-hidden', String(!s.expanded))
            byId('gc-request-workspace').setAttribute('aria-hidden', String(!s.expanded))
            setText(byId('gc-ticket-status'), s.ticketStatus)
            setText(
                byId('gc-assignment-caption'),
                s.working && !s.delivered ? 'In progress · Towels on the way' : 'Assigned · Staff notified',
            )
            taskSteps.forEach((node, i) => {
                node.classList.toggle('is-done', [s.sent, s.routed, s.delivered][i])
                node.classList.toggle('is-current', i === (s.delivered ? 2 : s.routed ? 1 : 0))
            })
            setText(byId('gc-story-caption'), CAPTIONS[s.chapter])
            chapters.forEach((button) => {
                if (button.dataset.gcChapter === s.chapter) button.setAttribute('aria-current', 'step')
                else button.removeAttribute('aria-current')
            })
            lastKey = key
        }
        chapters.forEach((button) =>
            button.style.setProperty('--chapter-progress', String(button.dataset.gcChapter === s.chapter ? s.progress : 0)),
        )
    }
    function syncPlayback() {
        const running = inView && !document.hidden && !userPaused
        demo.dataset.paused = String(!running)
        pause.setAttribute('aria-pressed', String(userPaused))
        const label = (userPaused ? 'Play' : 'Pause') + ' towel comparison'
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
        if (last !== null) elapsed = (elapsed + Math.min(Math.max(0, now - last), 150)) % GUSTAV_DURATION
        last = now
        paint()
        if (inView && !document.hidden && !userPaused) frame = requestAnimationFrame(tick)
    }
    function jump(chapter: Chapter) {
        elapsed = GUSTAV_CHAPTERS[chapter]
        last = null
        userPaused = true
        paint()
        syncPlayback()
        const button = chapters.find((b) => b.dataset.gcChapter === chapter)
        announcement.textContent = `${button?.textContent?.trim()}. Replay paused for inspection.`
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
        listen(button, 'click', () => jump(button.dataset.gcChapter as Chapter))
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
    viewButtons.forEach((button) =>
        listen(button, 'click', () => {
            demo.dataset.mobileView = button.dataset.gcView
            viewButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)))
            elapsed = reduced.matches ? GUSTAV_CHAPTERS.result : 0
            userPaused = reduced.matches
            last = null
            paint()
            syncPlayback()
            announcement.textContent = `${button.textContent?.trim()}. ${
                userPaused ? 'Showing the completed example.' : 'Replay restarted.'
            }`
        }),
    )
    listen(pause, 'click', () => {
        userPaused = !userPaused
        last = null
        syncPlayback()
        announcement.textContent = 'Towel comparison ' + (userPaused ? 'paused.' : 'playing.')
    })
    listen(replay, 'click', () => {
        elapsed = reduced.matches ? GUSTAV_CHAPTERS.result : 0
        userPaused = reduced.matches
        last = null
        paint()
        syncPlayback()
        announcement.textContent = 'Towel comparison restarted.'
    })
    const observer = new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting && entry.intersectionRatio >= 0.15
            syncPlayback()
        },
        { threshold: [0, 0.15] },
    )
    observer.observe(demo.querySelector('.gb-panels')!)
    const onReducedChange = () => {
        if (reduced.matches) {
            elapsed = GUSTAV_CHAPTERS.result
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
