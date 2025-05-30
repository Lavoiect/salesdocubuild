import AgencyDetails from "@/components/forms/agency-details";
import { IdentifyUserClient } from "@/components/global/IdentifyUserClient";
import SetUserRoleClient from "@/components/global/SetUserRoleClient";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { useUserStore } from "@/lib/store/useUserStore";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";





const Page = async ({searchParams}: 
    {searchParams: {plan: Plan; state: string; code: string}}) => {

    const agencyId = await verifyAndAcceptInvitation()
    //console.log('agencyID'+agencyId)

    //Get user details
    const user = await getAuthUserDetails()


    
      

    if(agencyId){
       
        if(user?.role === "OWNER"){
            if(searchParams.plan){
                return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
            }
            if(searchParams.state){
                const statePath = searchParams.state.split('__'[0]);
                const stateAgencyId = searchParams.state.split('__'[1]);
                if(!stateAgencyId){
                    <div>Not Authorized</div>
                }
                return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
            } else {return redirect(`/agency/${agencyId}`)}
        } else {
            return <div>Not Authorized</div>
        }
    }
    const authUser = await currentUser()
    return ( 
        
            <div className="flex justify-center items-center mt-4">
                <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
               
                {user && user.Agency && (
                    <IdentifyUserClient 
                        user={{
                            id: user.Agency.id,
                            name: user.Agency.name,
                            email: user.Agency.companyEmail,
                        }} 
                    />
                )}

                    <h1 className="text-4xl">Create An Agency</h1>
                    <AgencyDetails
                        data={{companyEmail: authUser?.emailAddresses[0].emailAddress}}
                    />
                </div>
            </div>
        );
}
 
export default Page;