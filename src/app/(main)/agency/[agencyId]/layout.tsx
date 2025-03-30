import { getNotificationsAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import Unauthorized from "../unauthorized/page";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/info-bar";
import SideBar from "@/components/global/side-bar";

type Props = {
    children: React.ReactNode
    params: {agencyId: string}
}

const layout = async ({children, params}: Props) => {
    const agencyId = await verifyAndAcceptInvitation()
    const user = await currentUser()

    if(!user){
        return redirect('/')
    }

    if(!agencyId){
        return redirect('/agency')
    }

    if(
        user.privateMetadata.role !== 'AGENCY_OWNER' &&
        user.privateMetadata.role !== 'AGENCY_ADMIN'
    )

    return <Unauthorized/>;

    let allNotifications: any = []
    const notifications = await getNotificationsAndUser(agencyId);
    if(notifications) allNotifications = notifications;

    return (
    <div>
        <div>
            <InfoBar notifications={allNotifications}/>
        </div>
        <div className="flex-row">
            <SideBar agencyId={agencyId}/>
            <div className="mt-[70px] bg-white ml-[50px] pt-8 h-screen">{children}</div>
        </div>
     </div>  
       
        
          
    
      
     
)}
 
export default layout;