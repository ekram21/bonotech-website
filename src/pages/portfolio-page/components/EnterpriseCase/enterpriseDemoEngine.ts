// Scripted product demonstration. All displayed records are illustrative; no queries are sent.
export const DEMO_DURATION = 23500
export const DEMO_QUESTION = 'Where is our latest consignment, and when will it arrive?'

type Phase = 'factory' | 'focus' | 'typing' | 'sending' | 'tracking' | 'return'
type Chapter = 'factory' | 'question' | 'tracking'

export function demoStateAt(elapsed: number) {
    const t = Number.isFinite(elapsed) ? Math.max(0, elapsed) % DEMO_DURATION : 0
    let phase: Phase = 'factory'
    if (t >= 21500) phase = 'return'
    else if (t >= 11000) phase = 'tracking'
    else if (t >= 9700) phase = 'sending'
    else if (t >= 6200) phase = 'typing'
    else if (t >= 5000) phase = 'focus'
    const chapter: Chapter =
        phase === 'factory' || phase === 'return' ? 'factory' : phase === 'tracking' ? 'tracking' : 'question'
    const typed =
        phase === 'typing'
            ? DEMO_QUESTION.slice(0, Math.ceil(((t - 6200) / 3500) * DEMO_QUESTION.length))
            : phase === 'sending' || phase === 'tracking'
              ? DEMO_QUESTION
              : ''
    const progress =
        chapter === 'factory'
            ? phase === 'return'
                ? 0
                : t / 5000
            : chapter === 'question'
              ? (t - 5000) / 6000
              : (t - 11000) / 10500
    return { phase, chapter, typed, progress }
}

type Point = [number, number, number?]

function drawFactory(svg: SVGSVGElement): () => void {
    const ns = 'http://www.w3.org/2000/svg'
    const element = (name: string, attrs: Record<string, string | number>, parent: Element = svg, text?: string) => {
        const node = document.createElementNS(ns, name)
        for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value))
        if (text !== undefined) node.textContent = text
        parent.append(node)
        return node
    }
    const project = (x: number, y: number, z = 0): [number, number] => [430 + (x - y) * 0.85, 192 + (x + y) * 0.36 - z]
    const points = (coordinates: Point[]) =>
        coordinates
            .map(([x, y, z]) =>
                project(x, y, z)
                    .map((v) => v.toFixed(1))
                    .join(','),
            )
            .join(' ')
    const line = (a: Point, b: Point, attrs: Record<string, string | number>, parent: Element = svg) =>
        element('polyline', { points: points([a, b]), fill: 'none', ...attrs }, parent)
    const polygon = (coordinates: Point[], attrs: Record<string, string | number>, parent: Element = svg) =>
        element('polygon', { points: points(coordinates), ...attrs }, parent)
    const floor = element('g', { class: 'ed-wireframe' })
    const grid = element('g', { class: 'ed-factory-grid' }, floor)
    for (let x = -90; x <= 650; x += 35) line([x, -80], [x, 420], {}, grid)
    for (let y = -80; y <= 420; y += 35) line([-90, y], [650, y], {}, grid)
    polygon(
        [
            [0, 0],
            [560, 0],
            [560, 330],
            [0, 330],
        ],
        { fill: '#231143', stroke: '#9c79d8', 'stroke-width': 1.5, 'fill-opacity': 0.5 },
        floor,
    )
    polygon(
        [
            [0, 0],
            [560, 0],
            [560, 0, 105],
            [0, 0, 105],
        ],
        { class: 'ed-factory-shell' },
        floor,
    )
    polygon(
        [
            [0, 0],
            [0, 330],
            [0, 330, 105],
            [0, 0, 105],
        ],
        { class: 'ed-factory-shell' },
        floor,
    )
    for (let x = 0; x <= 560; x += 112) line([x, 0], [x, 0, 105], { class: 'ed-factory-shell' }, floor)
    for (let y = 0; y <= 330; y += 110) line([0, y], [0, y, 105], { class: 'ed-factory-shell' }, floor)
    for (let x = 25; x <= 535; x += 102)
        line([x, 0, 95], [x + 45, 0, 95], { stroke: '#cfb5f8', class: 'ed-factory-light' }, floor)
    line([0, 330], [560, 330], { stroke: '#baa2e9', 'stroke-width': 2 }, floor)
    line([560, 330], [560, 0], { stroke: '#9872c9', 'stroke-width': 1.2 }, floor)

    const zones = [
        { x: 16, w: 94, color: '#54e8b0' },
        { x: 124, w: 93, color: '#50c8f5' },
        { x: 232, w: 108, color: '#f5c555' },
        { x: 355, w: 84, color: '#ec80cc' },
        { x: 455, w: 89, color: '#c3a0ff' },
    ]
    zones.forEach(({ x, w, color }) =>
        polygon(
            [
                [x, 12],
                [x + w, 12],
                [x + w, 314],
                [x, 314],
            ],
            { class: 'ed-floor-section', fill: color, stroke: color },
            floor,
        ),
    )
    zones.forEach(({ x, w, color }) =>
        line([x + w / 2, 10], [x + w / 2, 317], { stroke: color, class: 'ed-flow-path' }, floor),
    )

    const machine = (
        x: number,
        y: number,
        z: number,
        w: number,
        d: number,
        h: number,
        color: string,
        parent: Element = floor,
    ) => {
        const group = element('g', { class: 'ed-machine', stroke: color, fill: color }, parent)
        polygon(
            [
                [x, y, z + h],
                [x + w, y, z + h],
                [x + w, y + d, z + h],
                [x, y + d, z + h],
            ],
            { class: 'ed-machine-top' },
            group,
        )
        polygon(
            [
                [x, y, z],
                [x + w, y, z],
                [x + w, y, z + h],
                [x, y, z + h],
            ],
            { class: 'ed-machine-side' },
            group,
        )
        polygon(
            [
                [x + w, y, z],
                [x + w, y + d, z],
                [x + w, y + d, z + h],
                [x + w, y, z + h],
            ],
            { class: 'ed-machine-front' },
            group,
        )
        line([x, y + d, z], [x + w, y + d, z], {}, group)
        line([x, y + d, z], [x, y + d, z + h], {}, group)
        return group
    }
    // Storage racks, with multiple visible shelves and fabric rolls.
    for (const x of [28, 70])
        for (const y of [35, 115, 195, 265]) {
            const rack = machine(x, y, 0, 27, 39, 43, zones[0].color)
            for (const z of [13, 27])
                polygon(
                    [
                        [x, y, z],
                        [x + 27, y, z],
                        [x + 27, y + 39, z],
                        [x, y + 39, z],
                    ],
                    { fill: 'none', class: 'ed-machine-detail' },
                    rack,
                )
            for (const z of [6, 20, 34]) machine(x + 4, y + 8, z, 19, 24, 6, zones[0].color, rack)
        }
    // Cutting tables and fabric feed rollers.
    for (const x of [137, 179])
        for (const y of [38, 123, 208]) {
            const table = machine(x, y, 0, 29, 58, 15, zones[1].color)
            machine(x + 4, y + 4, 15, 21, 13, 11, zones[1].color, table)
            line([x + 5, y + 22, 16], [x + 24, y + 50, 16], { class: 'ed-machine-detail' }, table)
            line([x + 24, y + 22, 16], [x + 5, y + 50, 16], { class: 'ed-machine-detail' }, table)
        }
    // Eighteen sewing workstations across three parallel production lanes.
    for (const x of [242, 274, 306])
        for (const y of [28, 75, 122, 169, 216, 263]) {
            const bench = machine(x, y, 0, 22, 33, 15, zones[2].color)
            machine(x + 4, y + 7, 15, 13, 12, 13, zones[2].color, bench)
            line([x + 6, y + 19, 22], [x + 15, y + 19, 22], { class: 'ed-machine-detail' }, bench)
            machine(x + 6, y + 35, 0, 10, 9, 8, zones[2].color, bench)
        }
    // Inspection tables, garment rails and packed consignments.
    for (const x of [367, 404])
        for (const y of [33, 113, 193, 267]) {
            const table = machine(x, y, 0, 24, 31, 18, zones[3].color)
            line([x + 3, y + 9, 18], [x + 3, y + 9, 36], { class: 'ed-machine-detail' }, table)
            line([x + 3, y + 9, 36], [x + 22, y + 9, 36], { class: 'ed-machine-detail' }, table)
            for (const offset of [7, 14, 21])
                line([x + offset, y + 9, 36], [x + offset, y + 9, 23], { class: 'ed-machine-detail' }, table)
        }
    for (const x of [466, 504])
        for (const y of [31, 94, 157, 220, 274]) {
            const pallet = machine(x, y, 0, 28, 32, 5, zones[4].color)
            machine(x + 2, y + 2, 5, 24, 28, 19, zones[4].color, pallet)
            if (y < 200) machine(x + 6, y + 6, 24, 16, 20, 17, zones[4].color, pallet)
        }

    const labels: {
        x: number
        y: number
        title: string[]
        value: string
        width: number
        color: string
        target: [number, number, number]
        icon: keyof typeof icons
    }[] = [
        { x: 93, y: 30, title: ['Fabric Storage', '& Inspection'], value: '99.1% inspected', width: 164, color: zones[0].color, target: [55, 240, 43], icon: 'circle' },
        { x: 259, y: 112, title: ['Cutting'], value: '17.8K pcs / day', width: 162, color: zones[1].color, target: [170, 250, 15], icon: 'cut' },
        { x: 458, y: 30, title: ['Sewing Lines'], value: '18 lines · 102%', width: 160, color: zones[2].color, target: [279, 194, 27], icon: 'machine' },
        { x: 651, y: 112, title: ['Finishing', '& Quality Check'], value: '98.4% pass rate', width: 167, color: zones[3].color, target: [390, 204, 36], icon: 'shirt' },
        { x: 864, y: 30, title: ['Packing'], value: '1,280 cartons ready', width: 196, color: zones[4].color, target: [508, 223, 24], icon: 'box' },
    ]
    const icons = {
        circle: 'M9 0a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
        cut: 'M3 4 18 19M3 18 18 3M7 5a3 3 0 1 1-6-1 3 3 0 0 1 6 1Zm0 13a3 3 0 1 1-6-1 3 3 0 0 1 6 1Z',
        machine: 'M1 13h20M4 13V4h10v5h5v4M6 13v4m10-4v4',
        shirt: 'm1 4 6-3 3 3 3-3 6 3-3 5-3-2v12H7V7L4 9Z',
        box: 'm1 5 9-5 9 5-9 5Zm0 0v10l9 5 9-5V5M10 10v10',
    }
    labels.forEach((label) => {
        const [tx, ty] = project(...label.target)
        const startY = label.y + label.title.length * 20 + 37
        element('path', { d: `M${label.x + 18} ${startY}V${ty - 24}L${tx} ${ty}`, class: 'ed-label-leader', stroke: label.color })
        element('circle', { cx: tx, cy: ty, r: 4, class: 'ed-factory-dot', style: `color:${label.color}` })
        const group = element('g', {
            class: 'ed-stage-label',
            transform: `translate(${label.x} ${label.y})`,
            style: `color:${label.color}`,
        })
        element('path', { d: icons[label.icon], class: 'ed-label-icon', transform: 'translate(-29 1)' }, group)
        label.title.forEach((text, i) => element('text', { x: 0, y: 15 + i * 20 }, group, text))
        const chipY = label.title.length * 20 + 9
        element('rect', { x: -2, y: chipY, width: label.width, height: 28, rx: 7, class: 'ed-label-chip' }, group)
        element('circle', { cx: 10, cy: chipY + 14, r: 3, fill: 'currentColor' }, group)
        element('text', { x: 21, y: chipY + 19, class: 'ed-stage-value' }, group, label.value)
    })
    const mobile = document.createElement('div')
    mobile.className = 'ed-mobile-stages'
    mobile.setAttribute('aria-hidden', 'true')
    labels.forEach((label) => {
        const item = document.createElement('div')
        item.style.setProperty('--stage-color', label.color)
        const name = document.createElement('strong')
        name.textContent = label.title.join(' ')
        const value = document.createElement('span')
        value.textContent = label.value
        item.append(name, value)
        mobile.append(item)
    })
    svg.closest('.ed-factory')?.querySelector('.ed-metrics')?.after(mobile)
    const small = window.matchMedia('(max-width:760px)')
    const frame = () => svg.setAttribute('viewBox', small.matches ? '110 70 850 485' : '0 0 1160 555')
    small.addEventListener('change', frame)
    frame()
    return () => small.removeEventListener('change', frame)
}

const CHAPTER_TIME: Record<Chapter, number> = { factory: 0, question: 9699, tracking: 11000 }
const CAPTIONS: Record<Chapter, string> = {
    factory: 'One view of production, from fabric inspection to packing.',
    question: 'A business question becomes a request across connected data.',
    tracking: 'The same platform brings the consignment into view, with context.',
}

export function initEnterpriseDemo(section: HTMLElement): () => void {
    const device = section.querySelector<HTMLElement>('#enterprise-demo')!
    const undrawFactory = drawFactory(device.querySelector<SVGSVGElement>('#ed-factory-art')!)
    const pause = section.querySelector<HTMLButtonElement>('#ed-pause')!
    const replay = section.querySelector<HTMLButtonElement>('#ed-replay')!
    const chapters = [...section.querySelectorAll<HTMLButtonElement>('[data-chapter]')]
    const factory = device.querySelector<HTMLElement>('#ed-factory-view')!
    const tracking = device.querySelector<HTMLElement>('#ed-tracking-view')!
    const typed = device.querySelector<HTMLElement>('#ed-typed-question')!
    const screenName = device.querySelector<HTMLElement>('#ed-screen-name')!
    const queryState = device.querySelector<HTMLElement>('#ed-query-state')!
    const caption = section.querySelector<HTMLElement>('#ed-caption')!
    const announcement = section.querySelector<HTMLElement>('#ed-announcement')!
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)')
    const mobile = window.matchMedia('(max-width:760px)')
    const stage = device.querySelector<HTMLElement>('.ed-stage')!
    const floor = factory.querySelector<HTMLElement>('.ed-floor')!
    const metrics = factory.querySelector<HTMLElement>('.ed-metrics')!
    const grid = tracking.querySelector<HTMLElement>('.ed-tracking-grid')!
    const answer = tracking.querySelector<HTMLElement>('.ed-answer')!
    let disposed = false

    // Reserve real content space on phones; the floating question must clear live events.
    function fitMobileStage() {
        if (disposed) return
        if (!mobile.matches) {
            stage.style.removeProperty('height')
            return
        }
        const factoryHeight = floor.offsetTop + floor.offsetHeight + 112
        const cargoHeight = grid.offsetTop + grid.offsetHeight + 16 + answer.offsetHeight + 24
        stage.style.height = `${Math.ceil(Math.max(930, factoryHeight, cargoHeight))}px`
    }
    const sizeObserver = new ResizeObserver(fitMobileStage)
    ;[floor, metrics, grid, answer].forEach((node) => sizeObserver.observe(node))
    mobile.addEventListener('change', fitMobileStage)
    document.fonts.ready.then(fitMobileStage)
    fitMobileStage()

    let elapsed = 0
    let frameId = 0
    let previousTime: number | null = null
    let inView = false
    let userPaused = reduced.matches
    let previousPhase = ''
    let previousChapter = ''

    function paint() {
        const state = demoStateAt(elapsed)
        if (state.phase !== previousPhase) {
            device.dataset.phase = state.phase
            const cargo = state.phase === 'tracking'
            factory.setAttribute('aria-hidden', String(cargo))
            factory.inert = cargo
            tracking.setAttribute('aria-hidden', String(!cargo))
            tracking.inert = !cargo
            screenName.textContent = cargo ? 'Live Tracking' : 'Analytics Dashboard'
            queryState.textContent =
                state.phase === 'sending'
                    ? 'Finding the consignment across connected records…'
                    : 'Connected to approved business data'
            previousPhase = state.phase
        }
        if (typed.textContent !== state.typed) typed.textContent = state.typed
        if (state.chapter !== previousChapter) {
            chapters.forEach((button) => {
                if (button.dataset.chapter === state.chapter) button.setAttribute('aria-current', 'step')
                else button.removeAttribute('aria-current')
            })
            caption.textContent = CAPTIONS[state.chapter]
            previousChapter = state.chapter
        }
        chapters.forEach((button) =>
            button.style.setProperty(
                '--chapter-progress',
                String(button.dataset.chapter === state.chapter ? state.progress : 0),
            ),
        )
    }
    function updatePlayback() {
        const running = inView && !document.hidden && !userPaused
        device.dataset.paused = String(!running)
        pause.setAttribute('aria-pressed', String(userPaused))
        pause.setAttribute('aria-label', `${userPaused ? 'Play' : 'Pause'} product demonstration`)
        pause.title = `${userPaused ? 'Play' : 'Pause'} demonstration`
        if (!running) {
            cancelAnimationFrame(frameId)
            frameId = 0
            previousTime = null
        } else if (!frameId) {
            previousTime = null
            frameId = requestAnimationFrame(tick)
        }
    }
    function tick(now: number) {
        frameId = 0
        if (previousTime !== null) elapsed = (elapsed + Math.max(0, now - previousTime)) % DEMO_DURATION
        previousTime = now
        paint()
        if (inView && !document.hidden && !userPaused) frameId = requestAnimationFrame(tick)
    }
    const onPause = () => {
        userPaused = !userPaused
        updatePlayback()
        announcement.textContent = `Demonstration ${userPaused ? 'paused' : 'playing'}.`
    }
    const onReplay = () => {
        elapsed = 0
        previousTime = null
        userPaused = reduced.matches
        paint()
        updatePlayback()
        announcement.textContent = 'Factory overview. Demonstration restarted.'
    }
    const chapterHandlers = chapters.map((button) => {
        const onClick = () => {
            elapsed = CHAPTER_TIME[button.dataset.chapter as Chapter]
            previousTime = null
            userPaused = true
            paint()
            updatePlayback()
            announcement.textContent = `${button.textContent?.trim()}. Demonstration paused for inspection.`
        }
        button.addEventListener('click', onClick)
        return () => button.removeEventListener('click', onClick)
    })
    const onReducedChange = () => {
        if (reduced.matches) {
            userPaused = true
            elapsed = 0
            paint()
            updatePlayback()
        }
    }
    const observer = new IntersectionObserver(
        (entries) => {
            inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25
            updatePlayback()
        },
        { threshold: [0, 0.25] },
    )
    observer.observe(device)
    pause.addEventListener('click', onPause)
    replay.addEventListener('click', onReplay)
    document.addEventListener('visibilitychange', updatePlayback)
    reduced.addEventListener('change', onReducedChange)
    paint()
    updatePlayback()

    return () => {
        disposed = true
        cancelAnimationFrame(frameId)
        undrawFactory()
        sizeObserver.disconnect()
        observer.disconnect()
        mobile.removeEventListener('change', fitMobileStage)
        pause.removeEventListener('click', onPause)
        replay.removeEventListener('click', onReplay)
        chapterHandlers.forEach((remove) => remove())
        document.removeEventListener('visibilitychange', updatePlayback)
        reduced.removeEventListener('change', onReducedChange)
    }
}
