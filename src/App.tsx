import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { TermsOfService } from '@/pages/TermsOfService'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'

export default function App() {
    return (
        <BrowserRouter>
            <main className="min-h-screen w-full bg-surface-neutral text-content-primary">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}
