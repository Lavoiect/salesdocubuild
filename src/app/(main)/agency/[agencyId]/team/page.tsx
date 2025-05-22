import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"
import React from "react"
import DataTable from "./data-table"
import { Mail, Plus } from "lucide-react"
import { columns } from "./colums"
import SendInvitation from "@/components/forms/send-invitation"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/lib/store/useUserStore"

type Props = {
    params : {agencyId : string}
}


const TeamPage = async ({params} : Props) => {
    const authUser = await currentUser()
    const teamMembers = await db.user.findMany({
       where : {
            Agency: {
                id: params.agencyId
            },
       },
       include: {
        
       }
    })
    if(!authUser) return null

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        },
        
    })



    if(!agencyDetails) return 
    return (
        <div className="container">
            <h1 className="mb-3">Team Dashboard</h1>
            <Separator/>
             <DataTable
            actionButtonText = {
                <><Mail/>Invite User</>
            }
            modalChildren={<SendInvitation agencyId={agencyDetails.id}/>}
            filterValue="name"
            columns = {columns}
            data={teamMembers}
        />

       
        </div>
       
    )
}

export default TeamPage
