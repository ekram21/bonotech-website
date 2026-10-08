import { useEffect } from 'react'
import { Navbar } from '@/shared/Navbar'
import { PortfolioHero } from './components/PortfolioHero/PortfolioHero'
import './portfolio.css'
import { ProjectStack } from './components/ProjectStack/ProjectStack'
import { EnterpriseCase } from './components/EnterpriseCase/EnterpriseCase'
import { GustavCase } from './components/GustavCase/GustavCase'
import { DitechCase } from './components/DitechCase/DitechCase'
import { GrailCase } from './components/GrailCase/GrailCase'
import { OlmoCase } from './components/OlmoCase/OlmoCase'
import { PortfolioIndex } from './components/PortfolioIndex/PortfolioIndex'
import DiscoveryCallSection from '@/pages/home-page/components/DiscoveryCallSection'
import Footer from '@/shared/Footer/Footer'

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
                <EnterpriseCase />
                <GustavCase />
                <DitechCase />
                <OlmoCase />
                <GrailCase />
                <DiscoveryCallSection />
            </main>
            <Footer />
        </div>
    )
}
