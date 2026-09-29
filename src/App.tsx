import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { SplashScreen } from '@/components/SplashScreen/SplashScreen'

const AdminPortal = lazy(() =>
    import('@/pages/admin/AdminPortal').then((m) => ({ default: m.AdminPortal })),
)
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { HomePage } from './pages/home-page/HomePage'
import { scrollToHashOnLoad } from '@/lib/scroll'

function ScrollToTop() {
    const { pathname, hash } = useLocation()
    useEffect(() => {
        if (hash) {
            scrollToHashOnLoad()
            return
        }
        window.scrollTo(0, 0)
    }, [pathname, hash])
    return null
}

function isAdminPath(): boolean {
    return typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
}

export default function App() {
    const wantSplashPreview =
        typeof window !== 'undefined' &&
        new URLSearchParams(window.location.search).has('splashPreview')
    const skipSplash = isAdminPath() && !wantSplashPreview
    const [showSplash, setShowSplash] = useState(!skipSplash)
    const handleSplashComplete = useCallback(() => {
        if (wantSplashPreview) return
        setShowSplash(false)
        window.dispatchEvent(new Event('bonotech:splash-complete'))
        // Let Projects (sticky stack) remeasure after splash unmounts.
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
            scrollToHashOnLoad()
        })
    }, [wantSplashPreview])

    useEffect(() => {
        if (!wantSplashPreview) return
        setShowSplash(true)
    }, [wantSplashPreview])

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <BrowserRouter>
                <ScrollToTop />
                <AnalyticsTracker />
                <div className="min-h-screen w-full bg-[var(--ink)] text-[var(--white)]">
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
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
