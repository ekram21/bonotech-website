// import { AnnouncementBar } from '@/components/sections/AnnouncementBar/AnnouncementBar'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Hero } from '@/components/sections/Hero/Hero'
import { Clients } from '@/components/sections/Clients/Clients'
import { WhatWeDo } from '@/components/sections/WhatWeDo/WhatWeDo'
import { Projects } from '@/components/sections/Projects/Projects'
import { Testimonials } from '@/components/sections/Testimonials/Testimonials'
import { FAQ } from '@/components/sections/FAQ/FAQ'
import { Contact } from '@/components/sections/Contact/Contact'
import { Footer } from '@/components/sections/Footer/Footer'

export function HomePage() {
    return (
        <>
            {/* <AnnouncementBar /> */}
            <Navbar />
            <Hero />
            <Clients />
            <WhatWeDo />
            <Projects />
            <Testimonials />
            <FAQ />
            <Contact />
            <Footer />
        </>
    )
}
