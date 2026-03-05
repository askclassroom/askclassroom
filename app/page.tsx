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

const Page = async () => {
    return (
        <div>
            <Hero />
            <AboutUs />
            <WhyUs />
            <GetStarted />
            <PricingComponent />
            <FAQSection />
            <Teams />
            <Footer />
        </div>
    )
}

export default Page
