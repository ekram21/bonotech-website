import { useEffect, useRef } from 'react'
import gustav from '@/assets/clients/gustav.svg'
import ditech from '@/assets/clients/ditech.svg'
import olmo from '@/assets/clients/olmo.svg'
import getMyGrail from '@/assets/clients/get-my-grail.svg'
import evo from '@/assets/clients/evo.svg'
import polysignals from '@/assets/clients/polysignals.svg'
import { initPortfolioIndex } from './portfolioIndexEngine'
import './portfolio-index.css'

const CASES = [
    { href: '#gustav-case', logo: gustav, title: 'PMS & Concierge', client: 'Gustav' },
    { href: '#ditech-case', logo: ditech, title: 'CRM', client: 'DITECH' },
    { href: '#olmo-case', logo: olmo, title: 'Property Management', client: 'Olmo' },
    { href: '#grail-case', logo: getMyGrail, title: 'Web App', client: 'Get My Grail' },
    { href: '#evo-case', logo: evo, title: 'Card Prep Platform', client: 'EVO Grading' },
    { href: '#polysignals-case', logo: polysignals, title: 'Market Intelligence', client: 'Polysignals' },
]

const COUNT = String(CASES.length).padStart(2, '0')

export function PortfolioIndex() {
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        return initPortfolioIndex(root) ?? undefined
    }, [])

    return (
        <div ref={rootRef} className="portfolio-index" id="portfolio-index" hidden>
            <button
                className="pi-toggle"
                id="pi-toggle"
                type="button"
                aria-label="Explore portfolio projects"
                aria-expanded="false"
                aria-controls="pi-panel"
            >
                <svg className="pi-toggle-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                        d="M7 5h9M7 10h9M7 15h9M3 5h.1M3 10h.1M3 15h.1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="pi-rail" aria-hidden="true">
                    {Array.from({ length: Number(COUNT) }, (_, index) => <i key={index} />)}
                </span>
                <span className="pi-count" aria-hidden="true">
                    {COUNT}
                </span>
            </button>
            <nav className="pi-panel" id="pi-panel" aria-label="Portfolio projects" hidden>
                <div className="pi-heading">
                    <span>EXPLORE THE WORK</span>
                    <span>{COUNT}</span>
                </div>
                <ol className="pi-links">
                    {CASES.map((item) => (
                        <li key={item.href}>
                            <a href={item.href}>
                                <span className="pi-logo">
                                    <img src={item.logo} alt="" width={38} height={22} />
                                </span>
                                <span className="pi-copy">
                                    <strong>{item.title}</strong>
                                    <span>{item.client}</span>
                                </span>
                                <span className="pi-arrow" aria-hidden="true">
                                    ↗
                                </span>
                            </a>
                        </li>
                    ))}
                </ol>
                <p className="pi-hint">Jump to a project</p>
            </nav>
        </div>
    )
}
