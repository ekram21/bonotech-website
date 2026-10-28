const CHAPTERS = ['submit', 'prep', 'grading', 'return'] as const
type Chapter = (typeof CHAPTERS)[number]
const START: Record<Chapter, number> = { submit: 0, prep: 9000, grading: 18000, return: 27000 }
const DURATION = 36000
const STORIES: Record<Chapter, { label: string; title: [string, string]; description: string; window: string }> = {
    submit: { label: '01 / SUBMIT', title: ['A Clear Start', 'For Every Submission'], description: 'The collector chooses a service, adds card details and selects a grading tier The same submission arrives in EVO’s admin portal, ready for review', window: 'INTAKE / SUBMISSION REVIEW' },
    prep: { label: '02 / PREPARE', title: ['Every Card', 'A Traceable Workflow'], description: 'Once the physical cards arrive, EVO records each prep stage Status updates and customer messages stay attached to the submission', window: 'OPERATIONS / PREP WORKFLOW' },
    grading: { label: '03 / COORDINATE', title: ['Individual Cards', 'Organised Into Grading Batches'], description: 'Prepared cards are grouped by grading tier and tagged with a PSA order The team can coordinate a batch while keeping each collector’s submission identifiable', window: 'GRADING / PSA ORDER TAGGING' },
    return: { label: '04 / RETURN', title: ['Billing & Return Details', 'Tied To The Submission'], description: 'EVO can create grading and shipping invoices from the card list, selecting the relevant tiers and services Billing and shipping details stay with the submission', window: 'BILLING / INVOICE PREPARATION' },
}

export function initEvoDemo(root: HTMLElement): () => void {
    const demo = root.querySelector<HTMLElement>('#evo-demo')!
    const chapters = [...demo.querySelectorAll<HTMLButtonElement>('[data-ev-chapter]')]
    const screens = [...demo.querySelectorAll<HTMLElement>('[data-ev-phone], [data-ev-context]')]
    const pause = demo.querySelector<HTMLButtonElement>('#ev-pause')!
    const announcement = demo.querySelector<HTMLElement>('#ev-announcement')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let elapsed = 0, paused = reduced.matches, visible = false, last: number | null = null, frame = 0
    const text = (selector: string, value: string) => { const el = demo.querySelector<HTMLElement>(selector); if (el) el.textContent = value }
    const paint = () => {
        elapsed = ((elapsed % DURATION) + DURATION) % DURATION
        const scene: Chapter = elapsed >= START.return ? 'return' : elapsed >= START.grading ? 'grading' : elapsed >= START.prep ? 'prep' : 'submit'
        const story = STORIES[scene]
        demo.dataset.scene = scene
        screens.forEach((screen) => {
            const active = (screen.dataset.evPhone || screen.dataset.evContext) === scene
            screen.hidden = !active
            screen.setAttribute('aria-hidden', String(!active))
        })
        text('#ev-step-label', story.label); text('#ev-story-description', story.description); text('#ev-window-label', story.window)
        demo.querySelector('#ev-story-title')?.replaceChildren(document.createTextNode(story.title[0]), document.createElement('br'), document.createTextNode(story.title[1]))
        chapters.forEach((button) => {
            const current = button.dataset.evChapter === scene
            if (current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current')
            button.style.setProperty('--chapter-progress', current ? String(((elapsed - START[scene]) % 9000) / 9000) : '0')
        })
        const submitted = elapsed >= 3300, prepared = elapsed >= 13500, tagged = elapsed >= 22000, invoice = elapsed >= 31000
        for (const [key, value] of Object.entries({ submitted, prepared, tagged, invoiceSelected: invoice })) demo.dataset[key] = String(value)
        text('#ev-intake-status', submitted ? 'Ready for review' : 'Awaiting submission')
        text('#ev-intake-message', submitted ? 'EVO-DEMO-024 received' : 'The next submission starts here')
        text('#ev-intake-detail', submitted ? 'Card details, service choice and grading tier are linked in one record' : 'Submit the sample card on the left to see the shared record arrive')
        text('#ev-submit-label', submitted ? 'View prep workflow →' : 'Submit sample card →')
        text('#ev-prep-status', prepared ? 'Prep complete' : 'Prep in progress'); text('#ev-prep-detail', prepared ? 'Service completed' : 'Service in progress')
        text('#ev-prep-phone-status', prepared ? 'Ready for grading' : 'Cleaning & prep')
        text('#ev-batch-status', tagged ? 'Order tagged' : 'Ready to tag'); text('#ev-batch-reference', tagged ? 'PSA-DEMO-108' : 'Awaiting order tag'); text('#ev-phone-order', tagged ? 'PSA-DEMO-108' : 'Being assigned')
        text('#ev-return-status', invoice ? 'Tier selected' : 'Select tier')
    }
    const sync = () => {
        const running = visible && !document.hidden && !paused
        demo.dataset.paused = String(!running); pause.setAttribute('aria-pressed', String(paused)); pause.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} EVO journey`)
        if (!running) { cancelAnimationFrame(frame); frame = 0; last = null }
        else if (!frame) frame = requestAnimationFrame(tick)
    }
    const tick = (now: number) => { frame = 0; if (last !== null) elapsed += Math.min(Math.max(0, now - last), 150); last = now; paint(); if (visible && !document.hidden && !paused) frame = requestAnimationFrame(tick) }
    const select = (scene: Chapter, announce = true) => { elapsed = START[scene]; paused = true; last = null; paint(); sync(); if (announce) announcement.textContent = `${STORIES[scene].label}. Demonstration paused for inspection.` }
    const cleanups: (() => void)[] = []
    const on = <T extends EventTarget>(target: T, type: string, handler: EventListener) => { target.addEventListener(type, handler); cleanups.push(() => target.removeEventListener(type, handler)) }
    chapters.forEach((button, index) => {
        on(button, 'click', () => select(button.dataset.evChapter as Chapter))
        on(button, 'keydown', ((event: KeyboardEvent) => { const keys: Record<string, number> = { ArrowRight: (index + 1) % chapters.length, ArrowLeft: (index + chapters.length - 1) % chapters.length, Home: 0, End: chapters.length - 1 }; if (keys[event.key] !== undefined) { event.preventDefault(); chapters[keys[event.key]].focus(); chapters[keys[event.key]].click() } }) as EventListener)
    })
    on(demo.querySelector<HTMLButtonElement>('#ev-submit')!, 'click', () => { if (elapsed >= 3300) select('prep'); else { elapsed = 3300; paused = true; paint(); sync(); announcement.textContent = 'Sample submission received in EVO’s admin view This is a demonstration only' } })
    on(demo.querySelector<HTMLButtonElement>('#ev-tag')!, 'click', () => { elapsed = 22000; paused = true; paint(); sync(); announcement.textContent = 'Sample card linked to PSA demo order 108' })
    on(pause, 'click', () => { paused = !paused; sync(); announcement.textContent = `EVO journey ${paused ? 'paused' : 'playing'}.` })
    on(demo.querySelector<HTMLButtonElement>('#ev-replay')!, 'click', () => { elapsed = 0; paused = reduced.matches; paint(); sync(); announcement.textContent = 'EVO journey restarted' })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .1; sync() }, { threshold: [0, .1] })
    observer.observe(demo.querySelector<HTMLElement>('.ev-showcase')!)
    on(document, 'visibilitychange', sync); on(window, 'pagehide', () => { cancelAnimationFrame(frame); frame = 0; last = null })
    const reducedChanged = () => { if (reduced.matches) paused = true; sync() }
    reduced.addEventListener('change', reducedChanged); cleanups.push(() => reduced.removeEventListener('change', reducedChanged))
    paint(); sync()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); cleanups.forEach((cleanup) => cleanup()) }
}
