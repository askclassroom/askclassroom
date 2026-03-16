// export const dynamic = 'force-dynamic'

import React from 'react'
import Hero from '@/components/Hero'
import AboutUs from '@/components/AboutUs'
import WhyUs from '@/components/WhyUs'
import GetStarted from '@/components/GetStarted'
import PricingComponent from '@/components/PricingComponent'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import Teams from '@/components/Teams'
import FourWaysToLearn from '@/components/FourWaysToLearn'
import ContactUs from '@/components/ContactUs'
import Testimonials from '@/components/Testimonials'
import { getPublicFeedback } from '@/lib/actions/feedback.actions'

const Page = async () => {
    const feedbacks = await getPublicFeedback(12);

    return (
        <div>
            <Hero />
            <FourWaysToLearn />
            <AboutUs />
            {/* <WhyUs /> */}
            <GetStarted />
            <PricingComponent />
            {/* <FourWaysToLearn /> */}
            <Testimonials feedbacks={feedbacks} />
            <FAQSection />
            <Teams />
            <ContactUs />
            <Footer />

        </div>
    )
}

export default Page
