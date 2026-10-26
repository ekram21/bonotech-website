const CHAPTERS = ['markets', 'signal', 'reputation'] as const
type Chapter = (typeof CHAPTERS)[number]
const STORIES: Record<Chapter, { label: string; title: [string, string]; description: string; window: string }> = {
    markets: { label: '01 / EXPLORE', title: ['Market Sentiment', 'Made Visible'], description: 'Browse markets and categories, then see how analysts are positioned. The mobile and web views organise bullish and bearish sentiment around the assets people follow.', window: 'WEB VIEW / MARKET SENTIMENT' },
    signal: { label: '02 / TRACK', title: ['A Market Call', 'With A Record To Follow'], description: 'A published signal brings its target, date and price tracking into one view. Signal Arena adds community participation, while on-chain verification provides an immutable record of each signal.', window: 'COMMUNITY / SIGNAL ARENA' },
    reputation: { label: '03 / COMPARE', title: ['Analyst Reputation', 'In Plain View'], description: 'PolyRating, analyst performance and monthly leaderboards make reputation visible. These views show both a rating history and a season’s standings—two ways to explore the platform’s reputation system.', window: 'WEB VIEW / POLYRATING' },
}

export function initPolysignalsDemo(root: HTMLElement): () => void {
    const demo = root.querySelector<HTMLElement>('#polysignals-demo')!
    const chapters = [...demo.querySelectorAll<HTMLButtonElement>('[data-pl-chapter]')]
    const screens = [...demo.querySelectorAll<HTMLElement>('[data-pl-phone], [data-pl-context]')]
    const pause = demo.querySelector<HTMLButtonElement>('#pl-pause')!
    const announcement = demo.querySelector<HTMLElement>('#pl-announcement')!
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let elapsed = 0, paused = reduced.matches, visible = false, last: number | null = null, frame = 0
    const paint = () => {
        const index = Math.floor(elapsed / 10000) % CHAPTERS.length
        const scene = CHAPTERS[index], story = STORIES[scene]
        demo.dataset.scene = scene
        screens.forEach((screen) => { const active = (screen.dataset.plPhone || screen.dataset.plContext) === scene; screen.hidden = !active; screen.setAttribute('aria-hidden', String(!active)) })
        demo.querySelector('#pl-step-label')!.textContent = story.label
        demo.querySelector('#pl-story-title')!.replaceChildren(document.createTextNode(story.title[0]), document.createElement('br'), document.createTextNode(story.title[1]))
        demo.querySelector('#pl-story-description')!.textContent = story.description; demo.querySelector('#pl-window-label')!.textContent = story.window
        chapters.forEach((button, i) => { if (i === index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); button.style.setProperty('--chapter-progress', String(i < index ? 1 : i === index ? (elapsed % 10000) / 10000 : 0)) })
        demo.querySelectorAll<HTMLElement>('[data-pl-nav]').forEach((item) => item.classList.toggle('is-active', item.dataset.plNav === scene))
    }
    const sync = () => {
        const running = visible && !document.hidden && !paused
        demo.dataset.paused = String(!running); pause.setAttribute('aria-pressed', String(paused)); pause.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} Polysignals walkthrough`)
        if (!running) { cancelAnimationFrame(frame); frame = 0; last = null } else if (!frame) frame = requestAnimationFrame(tick)
    }
    const tick = (now: number) => { frame = 0; if (last !== null) elapsed = (elapsed + Math.min(Math.max(0, now - last), 150)) % 30000; last = now; paint(); if (visible && !document.hidden && !paused) frame = requestAnimationFrame(tick) }
    const cleanups: (() => void)[] = []
    const on = <T extends EventTarget>(target: T, type: string, handler: EventListener) => { target.addEventListener(type, handler); cleanups.push(() => target.removeEventListener(type, handler)) }
    chapters.forEach((button, index) => {
        on(button, 'click', () => { elapsed = index * 10000; paused = true; paint(); sync(); announcement.textContent = `${STORIES[CHAPTERS[index]].label}. Walkthrough paused for inspection.` })
        on(button, 'keydown', ((event: KeyboardEvent) => { const keys: Record<string, number> = { ArrowRight: (index + 1) % chapters.length, ArrowLeft: (index + chapters.length - 1) % chapters.length, Home: 0, End: chapters.length - 1 }; if (keys[event.key] !== undefined) { event.preventDefault(); chapters[keys[event.key]].focus(); chapters[keys[event.key]].click() } }) as EventListener)
    })
    on(pause, 'click', () => { paused = !paused; sync(); announcement.textContent = `Polysignals walkthrough ${paused ? 'paused' : 'playing'}.` })
    on(demo.querySelector<HTMLButtonElement>('#pl-replay')!, 'click', () => { elapsed = 0; paused = reduced.matches; paint(); sync(); announcement.textContent = 'Polysignals walkthrough restarted.' })
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: 0 })
    observer.observe(demo.querySelector<HTMLElement>('.pl-showcase')!)
    on(document, 'visibilitychange', sync); on(window, 'pagehide', () => { cancelAnimationFrame(frame); frame = 0; last = null })
    const reducedChanged = () => { if (reduced.matches) paused = true; sync() }
    reduced.addEventListener('change', reducedChanged); cleanups.push(() => reduced.removeEventListener('change', reducedChanged))
    paint(); sync()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); cleanups.forEach((cleanup) => cleanup()) }
}
