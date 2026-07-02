import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SplashScreen } from '@/components/SplashScreen/SplashScreen'
import { HomePage } from '@/pages/HomePage'
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

export default function App() {
    const [showSplash, setShowSplash] = useState(true)
    const handleSplashComplete = useCallback(() => {
        setShowSplash(false)
        // Let Projects (sticky stack) remeasure after splash unmounts.
        requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'))
        })
    }, [])

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <BrowserRouter>
                <ScrollToTop />
                <main className="min-h-screen w-full bg-surface-neutral text-content-primary">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </>
    )
}
