// import { AnnouncementBar } from '@/components/sections/AnnouncementBar/AnnouncementBar'
import { Navbar } from '@/components/sections/Navbar/Navbar'
import { Hero } from '@/components/sections/Hero/Hero'
import { Clients } from '@/components/sections/Clients/Clients'
// import { Introduction } from '@/components/sections/Introduction/Introduction'
import { IntroductionSection } from '@/components/sections/IntroductionSection/IntroductionSection'
import { WhatWeDo } from '@/components/sections/WhatWeDo/WhatWeDo'
import { AiApproach } from '@/components/sections/AiApproach/AiApproach'
import { Comparison } from '@/components/sections/Comparison/Comparison'
// import { Timeline } from '@/components/sections/Timeline/Timeline'
import { TimelineSection } from '@/components/sections/TimelineSection/TimelineSection'
// import { Speed } from '@/components/sections/Speed/Speed'
import { SpeedSection } from '@/components/sections/SpeedSection/SpeedSection'
import { Projects } from '@/components/sections/Projects/Projects'
import { Industries } from '@/components/sections/Industries/Industries'
// import { BonoExperience } from '@/components/sections/BonoExperience/BonoExperience'
import { BonoExperienceSection } from '@/components/sections/BonoExperienceSection/BonoExperienceSection'
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
            <AiApproach />
            {/* <Timeline /> */}
            <TimelineSection />
            {/* <Speed /> */}
            <SpeedSection />
            <Projects />
            <Industries />
            {/* <BonoExperience /> */}
            <BonoExperienceSection />
            <Testimonials />
            <FAQ />
            {/* <Contact /> */}
            <Scheduling />
            <Footer />
        </>
    )
}
