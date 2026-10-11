// Local illustrative walkthrough. No payment, pricing or custody services are called.
export const GRAIL_DURATION = 32000
export const GRAIL_CHAPTERS = { discover: 0, value: 6000, buy: 14000, manage: 21000 }

type Scene = keyof typeof GRAIL_CHAPTERS

const ENDS: Record<Scene, number> = { discover: 6000, value: 14000, buy: 21000, manage: GRAIL_DURATION }

export function grailStateAt(elapsed: number) {
    const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) % GRAIL_DURATION : 0
    const scene: Scene = time < 6000 ? 'discover' : time < 14000 ? 'value' : time < 21000 ? 'buy' : 'manage'
    return {
        scene,
        confirmed: time >= 17000,
        progress: (time - GRAIL_CHAPTERS[scene]) / (ENDS[scene] - GRAIL_CHAPTERS[scene]),
    }
}

const STORIES: Record<Scene, { label: string; title: [string, string]; description: string; window: string }> = {
    discover: {
        label: '01 / DISCOVER',
        title: ['The Right Card.', 'A Connected Experience.'],
        description: 'Collectors browse graded cards, explore the details and find the next addition to their collection.',
        window: 'MARKETPLACE / CARD DETAILS',
    },
    value: {
        label: '02 / UNDERSTAND VALUE',
        title: ['A Clearer View.', 'A More Informed Choice.'],
        description:
            'Card details, comparable sales and price history help collectors understand what they are buying. Values shown here are illustrative.',
        window: 'MARKET DATA / COMPARABLE SALES',
    },
    buy: {
        label: '03 / BUY',
        title: ['From A Great Find', 'To A Confirmed Order.'],
        description:
            'The selected card moves into checkout. Listing, payment and custody details stay connected through one order.',
        window: 'ORDERS / CHECKOUT & HANDOFF',
    },
    manage: {
        label: '04 / MANAGE',
        title: ['Their Collection.', 'Your Connected Operations.'],
        description:
            'Collectors see their cards in one place, while consignor and vault workflows keep the business behind each transaction connected.',
        window: 'OPERATIONS / COLLECTION & CUSTODY',
    },
}

export function initGrailDemo(section: HTMLElement): () => void {
    const demo = section.querySelector<HTMLElement>('#grail-demo')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const chapters = [...demo.querySelectorAll<HTMLButtonElement>('[data-gg-chapter]')]
    const screens = [...demo.querySelectorAll<HTMLElement>('[data-gg-phone], [data-gg-context]')]
    const nav = [...demo.querySelectorAll<HTMLButtonElement>('.gg-app-nav [data-gg-go]')]
    const goButtons = [...demo.querySelectorAll<HTMLButtonElement>('[data-gg-go]')]
    const pause = demo.querySelector<HTMLButtonElement>('#gg-pause')!
    const replay = demo.querySelector<HTMLButtonElement>('#gg-replay')!
    const confirm = demo.querySelector<HTMLButtonElement>('[data-gg-confirm]')!
    const announcement = demo.querySelector<HTMLElement>('#gg-announcement')!
    let elapsed = 0
    let userPaused = reduced.matches
    let inView = false
    let last: number | null = null
    let frame = 0
    let previousScene = ''
    let previousConfirmed: boolean | null = null
    const setText = (selector: string, text: string) => {
        demo.querySelector(selector)!.textContent = text
    }

    function paint() {
        const s = grailStateAt(elapsed)
        if (s.scene !== previousScene) {
            const story = STORIES[s.scene]
            demo.dataset.scene = s.scene
            screens.forEach((screen) => {
                const active = (screen.dataset.ggPhone || screen.dataset.ggContext) === s.scene
                screen.hidden = !active
                screen.setAttribute('aria-hidden', String(!active))
            })
            setText('#gg-step-label', story.label)
            demo
                .querySelector('#gg-story-title')!
                .replaceChildren(
                    document.createTextNode(story.title[0]),
                    document.createElement('br'),
                    document.createTextNode(story.title[1]),
                )
            setText('#gg-story-description', story.description)
            setText('#gg-window-label', story.window)
            chapters.forEach((button) => {
                if (button.dataset.ggChapter === s.scene) button.setAttribute('aria-current', 'step')
                else button.removeAttribute('aria-current')
            })
            nav.forEach((button) => {
                if (button.dataset.ggGo === s.scene) button.setAttribute('aria-current', 'page')
                else button.removeAttribute('aria-current')
            })
            previousScene = s.scene
        }
        if (s.confirmed !== previousConfirmed) {
            demo.dataset.checkout = s.confirmed ? 'confirmed' : 'cart'
            setText('#gg-order-title', s.confirmed ? 'Demo Order Confirmed.' : 'Ready For Checkout.')
            setText('#gg-payment-state', s.confirmed ? 'Confirmed' : 'Review')
            previousConfirmed = s.confirmed
        }
        chapters.forEach((button) =>
            button.style.setProperty('--chapter-progress', String(button.dataset.ggChapter === s.scene ? s.progress : 0)),
        )
    }
    function syncPlayback() {
        const running = inView && !document.hidden && !userPaused
        demo.dataset.paused = String(!running)
        pause.setAttribute('aria-pressed', String(userPaused))
        const label = (userPaused ? 'Play' : 'Pause') + ' collector journey'
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
        if (last !== null) elapsed = (elapsed + Math.min(Math.max(0, now - last), 150)) % GRAIL_DURATION
        last = now
        paint()
        if (inView && !document.hidden && !userPaused) frame = requestAnimationFrame(tick)
    }
    function select(scene: string, time?: number) {
        if (!(scene in GRAIL_CHAPTERS)) return
        elapsed = time ?? GRAIL_CHAPTERS[scene as Scene]
        userPaused = true
        last = null
        paint()
        syncPlayback()
        announcement.textContent = `${STORIES[scene as Scene].label}. Demonstration paused for inspection.`
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
        listen(button, 'click', () => select(button.dataset.ggChapter!))
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
    goButtons.forEach((button) => listen(button, 'click', () => select(button.dataset.ggGo!)))
    listen(confirm, 'click', () => {
        select('buy', 17000)
        announcement.textContent = 'Simulated order confirmed. No payment has been made.'
    })
    listen(pause, 'click', () => {
        userPaused = !userPaused
        last = null
        syncPlayback()
        announcement.textContent = 'Collector journey ' + (userPaused ? 'paused.' : 'playing.')
    })
    listen(replay, 'click', () => {
        elapsed = 0
        userPaused = reduced.matches
        last = null
        paint()
        syncPlayback()
        announcement.textContent = 'Collector journey restarted.'
    })
    const observer = new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting && entry.intersectionRatio >= 0.1
            syncPlayback()
        },
        { threshold: [0, 0.1] },
    )
    observer.observe(demo.querySelector('.gg-showcase')!)
    const onReducedChange = () => {
        if (reduced.matches) {
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
