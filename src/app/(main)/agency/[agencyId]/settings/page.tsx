import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

type Props = {
    params: {agencyId: string}
}


const SettingsPage = async ({params}: Props) => {
    const authUser = await currentUser();
    if(!authUser) return null

    const userDetails = await db.user.findUnique({
        where: {
            email: authUser.emailAddresses[0].emailAddress,
        },
    })

    if(!userDetails) return null
    
    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        },
        
    })

    if(!agencyDetails) return null

    

    return ( 
    <div className="flex lg:flex-row flex-col gap-4 container">
        <Tabs defaultValue="agency" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="agency">Agency</TabsTrigger>
        <TabsTrigger value="user">Profile</TabsTrigger>
        <TabsTrigger value="billing">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="agency">
      <AgencyDetails data={agencyDetails}/>
      </TabsContent>
      <TabsContent value="user">
      <UserDetails
            type="agency"
            id={params.agencyId}
            
            userData={userDetails}
       />
      </TabsContent>
      <TabsContent value="billing">
        <p>Billing</p>
        <p>Change subscription</p>
        <p>Delete Account</p>
      </TabsContent>
    </Tabs>
        
       
    </div> 
    );
}
 
export default SettingsPage;