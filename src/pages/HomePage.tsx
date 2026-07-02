// import { AnnouncementBar } from '@/components/sections/AnnouncementBar/AnnouncementBar'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Hero } from '@/components/sections/Hero/Hero'
import { Clients } from '@/components/sections/Clients/Clients'
// import { Introduction } from '@/components/sections/Introduction/Introduction'
import { IntroductionSection } from '@/components/sections/IntroductionSection/IntroductionSection'
import { WhatWeDo } from '@/components/sections/WhatWeDo/WhatWeDo'
import { Comparison } from '@/components/sections/Comparison/Comparison'
import { Timeline } from '@/components/sections/Timeline/Timeline'
import { Speed } from '@/components/sections/Speed/Speed'
import { Projects } from '@/components/sections/Projects/Projects'
import { BonoExperience } from '@/components/sections/BonoExperience/BonoExperience'
import { Testimonials } from '@/components/sections/Testimonials/Testimonials'
import { FAQ } from '@/components/sections/FAQ/FAQ'
import { Contact } from '@/components/sections/Contact/Contact'
import { Scheduling } from '@/components/sections/Scheduling/Scheduling'
import { Footer } from '@/components/sections/Footer/Footer'

export function HomePage() {
    return (
        <>
            {/* <AnnouncementBar /> */}
            <Navbar />
            <Hero />
            <Clients />
            {/* <Introduction /> */}
            <IntroductionSection />
            <Comparison />
            <WhatWeDo />
            <Timeline />
            <Speed />
            <Projects />
            <BonoExperience />
            <Testimonials />
            <FAQ />
            {/* <Contact /> */}
            <Scheduling />
            <Footer />
        </>
    )
}
