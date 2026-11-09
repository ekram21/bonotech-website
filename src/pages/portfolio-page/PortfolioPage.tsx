import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageMeta } from '@/lib/usePageMeta'
import { holdHashTarget } from '@/lib/scroll'
import { PortfolioHero } from './components/PortfolioHero/PortfolioHero'
import './portfolio.css'
import { ProjectStack } from './components/ProjectStack/ProjectStack'
// import { EnterpriseCase } from './components/EnterpriseCase/EnterpriseCase'
// Shared case heading and CTA styles are still used by the visible portfolio cases.
import './components/EnterpriseCase/enterprise-demo.css'
import { GustavCase } from './components/GustavCase/GustavCase'
import { DitechCase } from './components/DitechCase/DitechCase'
import { GrailCase } from './components/GrailCase/GrailCase'
import { OlmoCase } from './components/OlmoCase/OlmoCase'
import { PortfolioIndex } from './components/PortfolioIndex/PortfolioIndex'
import DiscoveryCallSection from '@/pages/home-page/components/DiscoveryCallSection'
import Footer from '@/shared/Footer/Footer'
import { EvoCase } from './components/EvoCase'
import { PolysignalsCase } from './components/PolysignalsCase'

const TITLE = 'Bonotech — Portfolio'
const DESCRIPTION = 'Explore Bonotech’s portfolio of custom software, connected platforms, and AI-native products built to move businesses forward.'

export function PortfolioPage() {
    const { hash } = useLocation()
    usePageMeta(TITLE, DESCRIPTION, '/portfolio-og.png')

    useLayoutEffect(() => {
        if (hash.length > 1) holdHashTarget(undefined, 'smooth')
    }, [hash])

    return (
        <div className="portfolio-page home-page-background">
            <PortfolioIndex />
            <main id="main-content" tabIndex={-1}>
                <PortfolioHero />
                <ProjectStack />
                {/* <EnterpriseCase /> */}
                <GustavCase />
                <DitechCase />
                <OlmoCase />
                <GrailCase />
                <EvoCase />
                <PolysignalsCase />
                <DiscoveryCallSection />
            </main>
            <Footer />
        </div>
    )
}
