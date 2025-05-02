
import { db } from "@/lib/db";
import { getWorkspaces } from "@/lib/queries";

import { currentUser } from "@clerk/nextjs";
import React from "react";

import { CreateWorkspacetBnt } from "./_components/create-workspace-btn";
import WorkspaceCard from "./_components/workspace-card";
import { CreateTemplatetBnt } from "./_components/create-template-btn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TemplateCard from "./_components/template-card";


const Page = async ({ params }: {
    params: {
        agencyId: string
    }
}) => {


    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        }
    })

    if (!agencyDetails) return

    const user = await currentUser();

    const workspaces = await getWorkspaces(params.agencyId)




    return (
        <div className="container">
        <Tabs defaultValue="workspace">
            <TabsList>
                <TabsTrigger value="workspace">Workspaces</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="workspace">
                
                    <div className="flex justify-between">
                        <div className="flex-col">
                            <h1 className="text-2xl">Welcome, {user ? user.firstName : "Guest"} </h1>
                            <h3>Workspaces</h3>
                        </div>
                        <div className="flex gap-1">
                            <CreateWorkspacetBnt agencyId={params.agencyId} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 gap-y-6 mt-7">
                        {workspaces.filter(workspace => workspace.type === 'Workspace').map(workspace => (
                            <div key={workspace.id} className="ml-6">
                                <WorkspaceCard
                                    agencyId={params.agencyId}
                                    workspace={workspace}
                                    documents={workspace.Documents}
                                />
                            </div>
                        ))}
                    </div>
                
            </TabsContent>
            <TabsContent value="templates">
                 <div className="flex justify-between">
                        <div className="flex-col">
                            <h1 className="text-2xl">Welcome, {user ? user.firstName : "Guest"} </h1>
                            <h3>Templates</h3>
                        </div>
                        <div className="flex gap-1">
                        <CreateTemplatetBnt agencyId={params.agencyId} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 gap-y-6 mt-7">
                {workspaces.filter(workspace => workspace.type === 'Template').map(workspace => (
                            <div key={workspace.id} className="ml-6">
                                <TemplateCard
                                    agencyId={params.agencyId}
                                    workspace={workspace}
                                    documents={workspace.Documents}
                                    workspaces={workspaces}
                                />
                            </div>
                        ))}
                        </div>
            </TabsContent>
        </Tabs>
    </div>
    );
}

export default Page;