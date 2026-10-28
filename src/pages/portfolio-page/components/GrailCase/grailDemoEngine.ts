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
        vaultSelected: time >= 17000,
        progress: (time - GRAIL_CHAPTERS[scene]) / (ENDS[scene] - GRAIL_CHAPTERS[scene]),
    }
}

const STORIES: Record<Scene, { label: string; title: [string, string]; description: string; window: string }> = {
    discover: {
        label: '01 / DISCOVER',
        title: ['The Right Card', 'A Connected Experience'],
        description: 'Collectors browse graded cards, explore the details and find the next addition to their collection',
        window: 'MARKETPLACE / CARD DETAILS',
    },
    value: {
        label: '02 / UNDERSTAND VALUE',
        title: ['A Clearer View', 'A More Informed Choice'],
        description: 'Collectors can scan a card or search comparable sales The value screen brings together a market overview and recently sold cards',
        window: 'VALUE / MARKET OVERVIEW',
    },
    buy: {
        label: '03 / BUY',
        title: ['A Card They Want', 'A Delivery Choice That Fits'],
        description: 'At checkout, collectors choose delivery to their home or a hold at their nearest vault This example shows the choice without placing an order',
        window: 'CHECKOUT / DELIVER TO',
    },
    manage: {
        label: '04 / MANAGE',
        title: ['Collector Tools', 'Connected Business Operations'],
        description: 'Collectors access their purchase history, collections and balance In a separate admin workspace, the team manages vaults, inventory and assigned consignors',
        window: 'OPERATIONS / VAULT INVENTORY',
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
    const deliveryButtons = [...demo.querySelectorAll<HTMLButtonElement>('[data-gg-delivery]')]
    const announcement = demo.querySelector<HTMLElement>('#gg-announcement')!
    let elapsed = 0
    let userPaused = reduced.matches
    let inView = false
    let last: number | null = null
    let frame = 0
    let previousScene = ''
    let previousDelivery: boolean | null = null
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
            setText('#gg-view-role', s.scene === 'manage' ? 'GMG TEAM / ADMIN PORTAL' : 'COLLECTOR / WEB MARKETPLACE')
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
        if (s.vaultSelected !== previousDelivery) {
            const destination = s.vaultSelected ? 'Vault' : 'Home'
            demo.dataset.delivery = destination.toLowerCase()
            setText('#gg-order-title', s.vaultSelected ? 'Hold At A Vault' : 'Deliver To Home')
            setText('#gg-payment-state', destination)
            setText('#gg-delivery-detail', s.vaultSelected ? 'Held at your nearest vault No shipping selected' : 'Ship to your address')
            deliveryButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.ggDelivery === destination.toLowerCase())))
            previousDelivery = s.vaultSelected
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
    deliveryButtons.forEach((button) => listen(button, 'click', () => {
        select('buy', button.dataset.ggDelivery === 'vault' ? 17000 : 14000)
        announcement.textContent = `${button.dataset.ggDelivery} delivery selected in this example No order has been placed`
    }))
    listen(pause, 'click', () => {
        userPaused = !userPaused
        last = null
        syncPlayback()
        announcement.textContent = 'Collector journey ' + (userPaused ? 'paused' : 'playing')
    })
    listen(replay, 'click', () => {
        elapsed = 0
        userPaused = reduced.matches
        last = null
        paint()
        syncPlayback()
        announcement.textContent = 'Collector journey restarted'
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
