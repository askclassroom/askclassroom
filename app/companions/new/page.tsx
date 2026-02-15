import CompanionForm from '@/components/CompanionForm'
import React from 'react'
import {auth} from"@clerk/nextjs/server"
import Image from 'next/image'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { newCompanionPermissions } from '@/lib/actions/companion.actions'

const NewCompanion = async () => {
  const {userId}=await auth();
  if(!userId) redirect('/sign-in');
  const canCreateCompanion=await newCompanionPermissions();
  return (
    <main className="lg:w-1/3 md:w-2/3 items-center justify-center">
      {canCreateCompanion ? (
        <article className='w-full gap-4 flex flex-col'>
        <h1>Companion Builders</h1>
        <CompanionForm />
        </article>
      ) : (
        <article className='companion-limit'>
          <Image src="/images/limit.svg" alt="Companion limit reached" width={360} height={230}/>
          <div className='cta-badge'>
            Upgrade Your Plan
          </div>
          <h1>You've Reached Your Limit</h1>
          <p>Upgrade to a premium plan to create more companions and unlock exclusive features.</p>
          <Link href="/subscription" className='btn-primary w-full justify-center'>Upgrade My Plan</Link>
        </article>
      )}
      
    </main>
    
  )
}

export default NewCompanion