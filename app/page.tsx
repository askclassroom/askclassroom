export const dynamic = 'force-dynamic'



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

const Page = async () => {
    return (
        <div>
            <Hero />
            <FourWaysToLearn />
            <AboutUs />
            <WhyUs />
            <GetStarted />
            <PricingComponent />
            {/* <FourWaysToLearn /> */}
            <FAQSection />
            <Teams />
            <Footer />
        </div>
    )
}

export default Page
