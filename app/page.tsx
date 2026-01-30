import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      
      <section className='home-section'>
        <CompanionCard
          id='123'
          name='Neura the Brainy Explorer'
          topic="Neural network of teh brain"
          subject="science"
          duration={45}
          color="#ffda6e"
        />
        <CompanionCard
          id='124'
          name='Neura the Brainy Explorer'
          topic="Neural network of teh brain"
          subject="science"
          duration={45}
          color="#efd0ff"
        />
        <CompanionCard
          id='125'
          name='Neura the Brainy Explorer'
          topic="Neural network of teh brain"
          subject="science"
          duration={45}
          color="#BDE7ff"
        />
      </section>

      <section className='home-section'>
        <CompanionsList 
          title='Recently completed sessions'
          companions={recentSessions}
          className='w-2/3 max-lg:-full'
        />
        <CTA/>
      </section>
    </main>
  )
}

export default Page