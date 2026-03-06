"use client";

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import NavItems from './NavItems'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <Link href='/'>
        <div className='flex items-center gap-3 cursor-pointer justify-center'>
          <Image
            src="/images/logo-png-cropped.svg"
            alt="Logo"
            width={60}
            height={60}
          />
          <div className='flex flex-col items-start justify-center'>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-gray-900">Tutor</span>
              <span className="text-[#02AAA0]">TalkAI</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium tracking-wide">Support Beyond The Classroom</p>
          </div>

        </div>
      </Link>
      <div className='flex items-center gap-8'>
        <NavItems />
        <SignedOut>
          <SignInButton>
            <button className='btn-signin'>Sign In</button>
          </SignInButton>
          <div>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />
        </SignedIn>

      </div>

    </nav>
  )
}

export default Navbar