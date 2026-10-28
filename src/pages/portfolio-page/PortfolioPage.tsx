import { usePageMeta } from '@/lib/usePageMeta'
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
import TestimonialsSection from '@/pages/home-page/components/TestimonialsSection'
import { EvoCase } from './components/EvoCase'
import { PolysignalsCase } from './components/PolysignalsCase'

const TITLE = 'Portfolio — Bonotech'
const DESCRIPTION = 'Digital products, platforms, and transformations engineered by Bonotech'

export function PortfolioPage() {
    usePageMeta(TITLE, DESCRIPTION)

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
                <TestimonialsSection />
                <DiscoveryCallSection />
            </main>
            <Footer />
        </div>
    )
}
