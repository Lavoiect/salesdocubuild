
import { CircleEllipsisIcon, Delete, Dot, Edit, MoreVertical, PlusCircle, Settings, ShieldEllipsis, Trash, UserPlus } from 'lucide-react';
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
import { Workspace } from '@prisma/client';
import { deleteDocument, getWorkspaces } from '@/lib/queries';
import { CreateDocumentBnt } from './create-document-btn';
import { CreateFromTemplateBtn } from './Create-from-template-btn';
import { CreateFromTemplateInWorkspaceBtn } from './create-From-template-In-Workspace-btn';
import { CreateDocumentAiBnt } from './create-document-ai';
import { toast } from "@/components/ui/use-toast";
import DeleteDocumentBtn from './delete-document-btn';


type Props = {
    agencyId: string
    workspace: any
    documents: Array<any>
}



const WorkspaceCard = async ({ agencyId, workspace, documents }: Props) => {
   const workspaces = await getWorkspaces(agencyId)

   
   

    return (
        <div>
            <div className="p-4 border-dashed border-2 rounded-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild> 
                        <div className='flex justify-end'>
                            <MoreVertical/>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>{workspace.name} Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            
                            <DropdownMenuItem>
                                <Settings size={15} className='mr-1'  />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                               
                                <span>Keyboard shortcuts</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <PlusCircle size={15} className='mr-1'/> 
                                    <span>Create Document</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                            
                                            <span><CreateDocumentAiBnt workspaceId={workspace.id}/></span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            
                                            <span><CreateDocumentBnt workspaceId={workspace.id} />
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            
                                            <span><CreateFromTemplateInWorkspaceBtn agencyId={agencyId} workspaces={workspaces}  workspaceId={workspace.id}/></span>
                                        </DropdownMenuItem>
                                       
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                               
                                <span>New Team</span>
                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            
                            <span>GitHub</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            
                            <span>Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            
                            <span>API</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <div className='flex items-center'>
                                <Trash size={15} className='text-red-600 mr-1'/>
                                <span className='text-muted-foreground'>Delete Workspace</span>
                            </div>
                           
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Image src={workspace.favicon || "/default-favicon.png"} alt="thumbnail" width={250} height={350} />
                <div>{workspace.name}</div>
                <div className="text-muted-foreground">{workspace.description}</div>
                <div>

                    <p>Documents</p>
                    {documents.length > 0 ? (
                        documents.map((doc) => {
                            
                                return (
                                    <div key={doc.id} className="flex items-center justify-between">
                                            {doc.name}
                                        <div className='flex items-center'>
                                        <Link href={`/agency/${agencyId}/documents/${doc.id}/${doc.id}/editor/${doc.DocumentPages[0].id}`}>
                                            <Edit />
                                        </Link>
                                            <DeleteDocumentBtn documentId={doc.id}/>
                                        </div>
                                        
                                    </div>
                                );
                            
                            return null;
                        })
                    ) : (
                        <div className="flex items-center">
                            No Documents in this workspace.
                        </div>
                    )}

                </div>
            </div>
            
                
        </div>
    )
}

export default WorkspaceCard