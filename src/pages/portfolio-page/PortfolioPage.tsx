import { useEffect } from 'react'
import { Navbar } from '@/shared/Navbar'
import { PortfolioHero } from './components/PortfolioHero/PortfolioHero'
import { ProjectStack } from './components/ProjectStack/ProjectStack'
import { PortfolioIndex } from './components/PortfolioIndex/PortfolioIndex'
import './portfolio.css'

const TITLE = 'Portfolio — Bonotech'
const DESCRIPTION = 'Digital products, platforms, and transformations engineered by Bonotech.'

function usePageMeta(title: string, description: string) {
    useEffect(() => {
        const previousTitle = document.title
        const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
        const previousDescription = meta?.content
        document.title = title
        if (meta) meta.content = description
        return () => {
            document.title = previousTitle
            if (meta && previousDescription !== undefined) meta.content = previousDescription
        }
    }, [title, description])
}

export function PortfolioPage() {
    usePageMeta(TITLE, DESCRIPTION)

    return (
        <div className="portfolio-page home-page-background">
            <Navbar />
            <PortfolioIndex />
            <main id="main-content" tabIndex={-1}>
                <PortfolioHero />
                <ProjectStack />
            </main>
        </div>
    )
}
