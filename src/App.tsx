import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { SplashScreen } from '@/components/SplashScreen/SplashScreen'

const AdminPortal = lazy(() =>
    import('@/pages/admin/AdminPortal').then((m) => ({ default: m.AdminPortal })),
)
const PortfolioPage = lazy(() =>
    import('@/pages/portfolio-page/PortfolioPage').then((m) => ({ default: m.PortfolioPage })),
)
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { HomePage } from './pages/home-page/HomePage'
import { DiscoveryMeetingPage } from '@/pages/discovery-meeting/DiscoveryMeetingPage'
import { scrollToHashOnLoad } from '@/lib/scroll'
import { Navbar } from '@/shared/Navbar'

/** Rendered once above the routes so it stays mounted across page changes. */
function SiteNavbar() {
    const { pathname } = useLocation()
    if (pathname.startsWith('/admin')) return null
    return <Navbar />
}

function ScrollToTop() {
    const { pathname } = useLocation()
    const navigationType = useNavigationType()

    useEffect(() => {
        // First load and back/forward keep the browser's scroll position.
        // Hash links on the same page are native anchors, so they are not handled here.
        if (navigationType === 'POP') return

        if (window.location.hash.length > 1) {
            scrollToHashOnLoad()
            return
        }

        window.scrollTo(0, 0)
    }, [pathname, navigationType])

    return null
}

const SPLASH_SEEN_KEY = 'bonotech:splash-seen'

function isAdminPath(): boolean {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
}

/** Full page loads (logo, hash links) remount the app. Keep the intro to the first visit. */
function splashAlreadySeen(): boolean {
    try {
        return sessionStorage.getItem(SPLASH_SEEN_KEY) === '1'
    } catch {
        return false
    }
}

function markSplashSeen(): void {
    try {
        sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {
        /* sessionStorage can throw in private mode */
    }
}

export default function App() {
    const wantSplashPreview =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).has('splashPreview')
    const skipSplash = (isAdminPath() || splashAlreadySeen()) && !wantSplashPreview
    const [showSplash, setShowSplash] = useState(!skipSplash)
    const handleSplashComplete = useCallback(() => {
        if (wantSplashPreview) return
        markSplashSeen()
        setShowSplash(false)
        window.dispatchEvent(new Event('bonotech:splash-complete'))
        // Let Projects (sticky stack) remeasure after splash unmounts.
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
            scrollToHashOnLoad()
        })
    }, [wantSplashPreview])

    useEffect(() => {
        if (!splashAlreadySeen() || wantSplashPreview) return
        window.dispatchEvent(new Event('bonotech:splash-complete'))
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
            scrollToHashOnLoad()
        })
    }, [wantSplashPreview])

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <BrowserRouter>
                <ScrollToTop />
                <AnalyticsTracker />
                <SiteNavbar />
                <div className="min-h-screen w-full bg-[var(--ink)] text-[var(--white)]">
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route
                            path="/portfolio"
                            element={
                                <Suspense fallback={null}>
                                    <PortfolioPage />
                                </Suspense>
                            }
                        />
                        <Route path="/discovery-meeting" element={<DiscoveryMeetingPage />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route
                            path="/admin"
                            element={
                                <Suspense fallback={null}>
                                    <AdminPortal />
                                </Suspense>
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </>
    )
}
