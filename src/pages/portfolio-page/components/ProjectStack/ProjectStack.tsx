import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from 'react'
import ditech from '@/assets/clients/ditech.svg'
import gustav from '@/assets/clients/gustav.svg'
import olmo from '@/assets/clients/olmo.svg'
import evo from '@/assets/clients/evo.webp'
import getMyGrail from '@/assets/clients/get-my-grail.svg'
import polysignals from '@/assets/clients/polysignals.svg'
import { createProjectStack, type ProjectStackEngine } from './projectStackEngine'
import './project-stack.css'

const PROJECTS = [
    { name: 'DITECH', logo: ditech, tint: '#e9e1f6', href: '#ditech-case' },
    { name: 'Gustav', logo: gustav, tint: '#e5dcef', href: '#gustav-case' },
    { name: 'Olmo', logo: olmo, tint: '#d7c5ec', href: '#olmo-case' },
    { name: 'EVO', logo: evo, tint: '#ddd7eb', href: '#evo-case', logoClassName: 'ps-logo-evo' },
    { name: 'Get My Grail', logo: getMyGrail, tint: '#dcd0ef', href: '#grail-case' },
    { name: 'Polysignals', logo: polysignals, tint: '#e5d9f2', href: '#polysignals-case' },
]

const TOTAL = String(PROJECTS.length).padStart(2, '0')
const CHOOSE_HINT_QUERY = '(max-width: 640px), (prefers-reduced-motion: reduce)'

function subscribeChooseHint(onChange: () => void) {
    const query = window.matchMedia(CHOOSE_HINT_QUERY)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
}

function useChooseHint() {
    return useSyncExternalStore(
        subscribeChooseHint,
        () => window.matchMedia(CHOOSE_HINT_QUERY).matches,
        () => false,
    )
}

export function ProjectStack() {
    const stageRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<HTMLDivElement>(null)
    const selectorsRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef<ProjectStackEngine | null>(null)
    const [selected, setSelected] = useState(0)
    const chooseHint = useChooseHint()

    useLayoutEffect(() => {
        const stage = stageRef.current
        const scene = sceneRef.current
        const selectors = selectorsRef.current
        if (!stage || !scene || !selectors) return

        const engine = createProjectStack(
            {
                stage,
                scene,
                cards: [...scene.querySelectorAll<HTMLElement>('.ps-panel')],
                buttons: [...selectors.querySelectorAll<HTMLButtonElement>('button')],
            },
            setSelected,
        )
        engineRef.current = engine
        return () => {
            engine.destroy()
            engineRef.current = null
        }
    }, [])

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const count = PROJECTS.length
        const destinations: Record<string, number> = {
            ArrowRight: (index + 1) % count,
            ArrowLeft: (index - 1 + count) % count,
            Home: 0,
            End: count - 1,
        }
        if (!(event.key in destinations)) return
        event.preventDefault()
        engineRef.current?.select(destinations[event.key], 'keyboard')
    }

    return (
        <section id="highlighted-projects" className="project-stack is-enhanced" aria-labelledby="ps-title">
            <div className="ps-layout">
                <header className="ps-heading">
                    <p className="ps-eyebrow">HIGHLIGHTED PROJECTS</p>
                    <h2 id="ps-title">
                        A Stack Of Projects<span>Across Every Scale</span>
                    </h2>
                    <p className="ps-description">
                        Digital work for a diverse range of businesses. <br />
                        From ambitious startups to established enterprises.
                    </p>
                </header>
                <div ref={stageRef} className="ps-stage">
                    <div className="ps-floor" aria-hidden="true" />
                    <div ref={sceneRef} className="ps-scene">
                        {PROJECTS.map((project, index) => (
                            <a
                                key={project.name}
                                className="ps-panel"
                                href={project.href}
                                aria-label={`View ${project.name} project`}
                                onFocus={() => engineRef.current?.select(index, 'click')}
                                style={{ '--panel-tint': project.tint } as CSSProperties}
                            >
                                <div className="ps-panel-meta">
                                    <span aria-hidden="true">Open project</span>
                                    <svg viewBox="0 0 20 20" aria-hidden="true">
                                        <path d="M5 15 15 5M5 5h10v10" />
                                    </svg>
                                </div>
                                <div className="ps-panel-logo">
                                    <img
                                        src={project.logo}
                                        alt={project.name}
                                        className={project.logoClassName}
                                        width={230}
                                        height={110}
                                        loading="lazy"
                                        draggable={false}
                                    />
                                </div>
                                <div className="ps-panel-label">
                                    {project.name}
                                    <span>
                                        {String(index + 1).padStart(2, '0')} / {TOTAL}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="ps-controls">
                    <p className="ps-hint">
                        <svg viewBox="0 0 20 20" aria-hidden="true">
                            <path d="m4 2 11 9-6 1-2 6Z" />
                        </svg>
                        <span>
                            {chooseHint
                                ? 'Choose a company to explore the stack'
                                : 'Click a card to view the project'}
                        </span>
                    </p>
                    <div ref={selectorsRef} className="ps-selectors" role="group" aria-label="Highlighted projects">
                        {PROJECTS.map((project, index) => (
                            <button
                                key={project.name}
                                type="button"
                                aria-pressed={selected === index}
                                aria-label={`Explore ${project.name}`}
                                onClick={() => engineRef.current?.select(index, 'click')}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                            >
                                {project.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
