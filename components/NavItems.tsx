// 'use client';

// import  Link  from 'next/link'
// import { usePathname } from 'next/navigation'
// import React from 'react'
// import { cn } from '@/lib/utils';

// const navItems=[
//     {label:'Home', href:'/'},
//     {label:'Companions', href:'/companions'},
//     {label:'My Journey', href:'/my-journey'},
// ]

// const NavItems = () => {
//     const pathname=usePathname();
//   return (
//     <nav className='flex items-center gap-4'>
//         {navItems.map(({label, href})=>(
//             <Link 
//             href={href} 
//             key={label} 
//             className={cn(pathname===href && 'text-primary font-semibold')}>
//                 {label}
//             </Link>
//         ))}
//     </nav>
//   )
// }

// export default NavItems

'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Home, Users, BookOpen } from 'lucide-react'

const NavItems = () => {
    const pathname = usePathname();

    const items = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/companions', label: 'Companions', icon: Users },
        { href: '/my-journey', label: 'My Journey', icon: BookOpen },
        { href: '/my-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <div className="flex gap-1">
            {items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                            isActive
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="max-md:hidden">{label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default NavItems;