import { Navbar } from '@/shared/Navbar'
import Hero from './components/Hero/Hero'
import SprintMetricsSection from './components/SprintMetricsSection'
import ClientShowcaseSection from './components/client-showcase-section/ClientShowcaseSection'
import AboutImpactSection from './components/AboutImpactSection'
import BusinessScopesSection from './components/Business-scopes-section/BusinessScopesSection'
import DeliveryTimesSection from './components/DeliveryTimesSection'
import TechnologyStackSection from './components/TechnologyStackSection'
import TestimonialsSection from './components/TestimonialsSection'
import DiscoveryCallSection from './components/DiscoveryCallSection'
import Footer from '@/shared/Footer/Footer'

export function HomePage() {
    return (
        <>
            <Navbar />
            <main className="home-page-background">
                <Hero />
                <SprintMetricsSection />
                <ClientShowcaseSection />
                <AboutImpactSection />
                <DeliveryTimesSection />
                <BusinessScopesSection />
                <TechnologyStackSection />
                <TestimonialsSection />
                <DiscoveryCallSection />
            </main>
            <Footer />
        </>
    )
}
