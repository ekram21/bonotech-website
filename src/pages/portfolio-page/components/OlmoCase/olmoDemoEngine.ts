// Illustrative local walkthrough: no payment, chat or property systems are contacted.
export const OLMO_DURATION = 34000
export const OLMO_CHAPTERS = { rent: 6500, repairs: 18000, properties: 24000 }
export const OLMO_REQUEST = 'The bathtub is cracked. Could someone take a look?'

type Scene = keyof typeof OLMO_CHAPTERS

const STARTS: Record<Scene, number> = { rent: 0, repairs: 10000, properties: 22000 }
const ENDS: Record<Scene, number> = { rent: 10000, repairs: 22000, properties: OLMO_DURATION }

export function olmoStateAt(elapsed: number) {
    const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) % OLMO_DURATION : 0
    const scene: Scene = time < 10000 ? 'rent' : time < 22000 ? 'repairs' : 'properties'
    const letters = Math.floor(OLMO_REQUEST.length * Math.max(0, Math.min(1, (time - 10400) / 2300)))
    return {
        scene,
        paid: time >= 3000,
        repair: time < 13000 ? 'draft' : time < 16000 ? 'sent' : 'assigned',
        request: OLMO_REQUEST.slice(0, letters),
        record: Math.floor(time / 2500) % 4,
        progress: (time - STARTS[scene]) / (ENDS[scene] - STARTS[scene]),
    }
}

const DESCRIPTIONS: Record<Scene, { title: string; role: string; caption: string }> = {
    rent: {
        title: 'Rent & Payments',
        role: 'Tenant + Landlord',
        caption: 'An in-app rent payment is matched to the correct unit and month, with a receipt and a shared record.',
    },
    repairs: {
        title: 'Maintenance',
        role: 'Tenant + Property Manager',
        caption:
            'A tenant’s message and photo become an assigned repair ticket, with the flat, timestamp and updates kept together.',
    },
    properties: {
        title: 'Properties & Units',
        role: 'Landlord',
        caption:
            'Landlords oversee properties and occupancy, managers handle day-to-day operations, and tenants access their own payments and documents.',
    },
}

export function initOlmoDemo(section: HTMLElement): () => void {
    const demo = section.querySelector<HTMLElement>('#olmo-demo')!
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)')
    const chapters = [...demo.querySelectorAll<HTMLButtonElement>('[data-oc-chapter]')]
    const scenes = [...demo.querySelectorAll<HTMLElement>('[data-oc-scene]')]
    const pause = demo.querySelector<HTMLButtonElement>('#oc-pause')!
    const replay = demo.querySelector<HTMLButtonElement>('#oc-replay')!
    const announcement = demo.querySelector<HTMLElement>('#oc-announcement')!
    let elapsed = reduced.matches ? OLMO_CHAPTERS.rent : 0
    let userPaused = reduced.matches
    let inView = false
    let last: number | null = null
    let frame = 0
    let previousScene = ''
    let previousPaid: boolean | null = null
    let previousRepair = ''
    const setText = (selector: string, text: string) => {
        const node = demo.querySelector<HTMLElement>(selector)!
        if (node.textContent !== text) node.textContent = text
    }

    function paint() {
        const s = olmoStateAt(elapsed)
        demo.dataset.record = String(s.record)
        setText('#oc-request-text', s.request || '')
        if (s.scene !== previousScene) {
            demo.dataset.scene = s.scene
            scenes.forEach((scene) => {
                const active = scene.dataset.ocScene === s.scene
                scene.hidden = !active
                scene.setAttribute('aria-hidden', String(!active))
            })
            setText('#oc-screen-name', DESCRIPTIONS[s.scene].title)
            setText('#oc-workspace-role', DESCRIPTIONS[s.scene].role)
            setText('#oc-caption', DESCRIPTIONS[s.scene].caption)
            chapters.forEach((button) => {
                if (button.dataset.ocChapter === s.scene) button.setAttribute('aria-current', 'step')
                else button.removeAttribute('aria-current')
            })
            previousScene = s.scene
        }
        if (s.paid !== previousPaid) {
            demo.dataset.rent = s.paid ? 'paid' : 'pending'
            setText('#oc-payment-label span', s.paid ? 'Payment Confirmed' : 'Payment being confirmed…')
            setText('#oc-paid-badge', s.paid ? 'Paid' : 'Awaiting payment')
            setText('#oc-receipt-title', s.paid ? 'Matched. Receipted.' : 'Ready To Reconcile')
            setText('#oc-receipt-id', s.paid ? 'OLM-DEMO-1042' : 'Awaiting confirmation')
            setText(
                '#oc-rent-caption',
                s.paid
                    ? 'Flat 4B · September · Paid. Both workspaces reflect the same rent record.'
                    : 'The unit, rental month and payment stay connected from the start.',
            )
            demo.querySelector('.oc-receipt-confirmation')!.setAttribute('aria-hidden', String(!s.paid))
            previousPaid = s.paid
        }
        if (s.repair !== previousRepair) {
            demo.dataset.repair = s.repair
            setText(
                '#oc-ticket-status',
                s.repair === 'assigned' ? 'Assigned' : s.repair === 'sent' ? 'Received' : 'Ready to receive',
            )
            setText('#oc-assignee', s.repair === 'assigned' ? 'Maintenance team' : 'Awaiting assignment')
            previousRepair = s.repair
        }
        chapters.forEach((button) =>
            button.style.setProperty('--chapter-progress', String(button.dataset.ocChapter === s.scene ? s.progress : 0)),
        )
    }
    function syncPlayback() {
        const running = inView && !document.hidden && !userPaused
        demo.dataset.paused = String(!running)
        pause.setAttribute('aria-pressed', String(userPaused))
        const label = (userPaused ? 'Play' : 'Pause') + ' Olmo demonstration'
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
        if (last !== null) elapsed = (elapsed + Math.min(Math.max(0, now - last), 150)) % OLMO_DURATION
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
            elapsed = OLMO_CHAPTERS[button.dataset.ocChapter as Scene]
            userPaused = true
            last = null
            paint()
            syncPlayback()
            announcement.textContent = `${button.textContent?.trim()}. Demonstration paused for inspection.`
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
        announcement.textContent = 'Olmo demonstration ' + (userPaused ? 'paused.' : 'playing.')
    })
    listen(replay, 'click', () => {
        elapsed = reduced.matches ? OLMO_CHAPTERS.rent : 0
        userPaused = reduced.matches
        last = null
        paint()
        syncPlayback()
        announcement.textContent = 'Olmo demonstration restarted.'
    })
    const observer = new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting && entry.intersectionRatio >= 0.15
            syncPlayback()
        },
        { threshold: [0, 0.15] },
    )
    observer.observe(demo.querySelector('.oc-device')!)
    const onReducedChange = () => {
        if (reduced.matches) {
            userPaused = true
            elapsed = OLMO_CHAPTERS.rent
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
