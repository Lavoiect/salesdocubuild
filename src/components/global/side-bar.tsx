'use client'
import { BarChartBig, File, Paperclip, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


type Props = {
    agencyId: string
}

const SideBar = ({agencyId}: Props) => {
  const pathname = usePathname();

  return (
    <div className='text-primary w-[50px] height-[500px] bg-white border border-1 p-8 flex flex-col fixed items-center gap-4 h-screen'>
       <Link className={pathname == `/agency/${agencyId}` ? "text-gray-300" : ""} href={`/agency/${agencyId}`} ><File size={30}/></Link> 
       <Link className={pathname == `/agency/${agencyId}/analytics` ? "text-gray-300" : ""} href={`/agency/${agencyId}/analytics`}><BarChartBig size={30}/></Link> 
       <Link className={pathname == `/agency/${agencyId}/media` ? "text-gray-300" : ""} href={`/agency/${agencyId}/media`} ><Paperclip size={30}/></Link> 
       <Link className={pathname == `/agency/${agencyId}/team` ? "text-gray-300" : ""} href={`/agency/${agencyId}/team`} ><User size={30}/></Link> 
       <Link className={pathname == `/agency/${agencyId}/settings` ? "text-gray-300" : ""} href={`/agency/${agencyId}/settings`} ><Settings size={30}/></Link> 
    </div>
  )
}

export default SideBar