import { usePageMeta } from '@/lib/usePageMeta'
import DiscoveryCallSection from '@/pages/home-page/components/DiscoveryCallSection'
import Footer from '@/shared/Footer/Footer'
import './discovery-meeting.css'

const TITLE = 'Book a Discovery Call — Bonotech'
const DESCRIPTION =
    'Schedule a free 30-minute discovery call with Bonotech to map your next build and define the right approach.'

export function DiscoveryMeetingPage() {
    usePageMeta(TITLE, DESCRIPTION)

    return (
        <>
            <main id="main-content" tabIndex={-1} className="discovery-meeting-page home-page-background">
                <DiscoveryCallSection />
            </main>
            <Footer />
        </>
    )
}
