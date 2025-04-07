
import { Edit, MoreVertical, PlusCircle, Settings, Trash } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { getWorkspaces } from '@/lib/queries';
import { CreateDocumentBnt } from './create-document-btn';
import { CreateFromTemplateInWorkspaceBtn } from './create-From-template-In-Workspace-btn';
import { CreateDocumentAiBnt } from './create-document-ai';
import DeleteDocumentBtn from './delete-document-btn';
import Header from './header';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"





type Props = {
    agencyId: string
    workspace: any
    documents: Array<any>
}



const WorkspaceCard = async ({ agencyId, workspace, documents }: Props) => {
    const workspaces = await getWorkspaces(agencyId)




    return (
        <div>
            <Card className='bg-white shadow-md rounded-md'>
                <CardHeader>
                    <CardTitle>
                        <Header workspace={workspace} agencyId={agencyId} />

                    </CardTitle>
                    <CardDescription>
                        <Image src={workspace.favicon || "/assets/documentIcon.png"} alt="thumbnail" width={175} height={200} className='m-auto mt-5 mb-5' />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <div className='flex justify-end items-center gap-2'>
                    <span>Add New Document</span>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger><PlusCircle className='text-primary' size={20} /></MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>
                                    <span><CreateDocumentAiBnt agencyId={agencyId} useAi={true} workspaceId={workspace.id} /></span>
                                </MenubarItem>
                                <MenubarItem>
                                    <span><CreateDocumentBnt useAi={false} workspaceId={workspace.id} /></span>

                                </MenubarItem>

                                <MenubarItem>
                                    <span><CreateFromTemplateInWorkspaceBtn agencyId={agencyId} workspaces={workspaces} workspaceId={workspace.id} /></span>

                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
               
                   
                    {documents.length > 0 ? (
                        documents.map((doc) => {

                            return (
                                <div key={doc.id} className=" mt-3 w-full">
                                    <Card className='bg-white shadow-md rounded-md w-full  p-2' >
                                        <div className='flex justify-between'>
                                            <div>
                                            <CardTitle className='text-lg font-semibold'>
                                                {doc.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {doc.description}
                                            </CardDescription>
                                            </div>
                                            <div className='flex gap-2'>
                                            {doc.DocumentPages && doc.DocumentPages.length > 0 ? (
                                                <Link href={`/agency/${agencyId}/documents/${doc.id}/${doc.id}/editor/${doc.DocumentPages[0].id}`}>
                                                    <Edit size={20} className='text-slate-400' />
                                                </Link>
                                            ) : 'Generating'}
                                            <DeleteDocumentBtn documentId={doc.id} />
                                        </div>
                                        
                                        </div>
                                        <p className='text-sm text-muted-foreground mt-3'>Created:  {new Date(doc.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                       
                                      
                                      
                                    </Card>





                                </div>
                            );

                            return null;
                        })
                    ) : (
                        <div className="flex items-center text-muted-foreground text-sm">
                            No Documents in this workspace.
                        </div>
                    )}

                </CardContent>
                
               
            </Card>


        </div>
    )
}

export default WorkspaceCard