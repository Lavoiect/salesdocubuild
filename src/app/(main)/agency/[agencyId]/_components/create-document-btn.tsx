'use client'

import CreateDocumentForm from "@/components/forms/create-document-form"
import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"

type Props = {
   workspaceId: string
   useAi: boolean
   type: string
}
export const CreateDocumentBnt = ({ workspaceId, useAi, type }: Props) => {
    const {setOpen} = useModal()

    const handleCreateWorkspace = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document"
                subheading="Create a workspace for your documents"
            >
               <div>
               
                {String(useAi)}
               </div>
                <CreateDocumentForm useAi={useAi} workspaceId={workspaceId} type={type}/>
            </CustomModal>
        )
    }

    return (
        <span onClick={handleCreateWorkspace}>Create From Scratch</span>
    )
}
