import {User} from '@clerk/nextjs/server'
import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/global/mode-toggle';

type Props = {
    user?:null|User
}

const Navigation = () => {
    return ( 
        <div className='fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-10'>
            <aside className='flex items-center gap-2'>
                <Image alt='logo' src={'./assets/plura-logo.svg'} height={40} width={40}/>
                <span className='font-bold text-xl'>Plura.</span>
            </aside>
                <nav className='hidden md:block absolute top-[50%] left-[50%]
                      transform translate-x-[-50%] translate-y-[-50%]'>
                        <ul className='flex items-center justify-center gap-8'>
                            <Link href={'#'}>About</Link>
                            <Link href={'#'}>Pricing</Link>
                            <Link href={'#'}>Documentation</Link>
                            <Link href={'#'}>Features</Link>
                        </ul>
                      </nav>
                      <aside className='flex gap-2 items-center'>
                            <Link className='bg-primary text-white p-2
                                             px-4 rounded-md hover:bg-sky-200' href={'/agency'}>
                                                Log In
                                            </Link>
                                            <UserButton></UserButton>
                                            <ModeToggle></ModeToggle>
                      </aside>
            
        </div>
     );
}
 
export default Navigation;