'use client'

import CreateDocFromTemplateForm from "@/components/forms/create-doc-from-Template"
import CreateDocFromTemplateWorkspaceForm from "@/components/forms/create-doc-from-Template-workspace"
import CreateDocumentForm from "@/components/forms/create-document-form"
import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"
import { Workspace } from "@prisma/client"
import { CopyPlusIcon, Sparkles } from "lucide-react"

type Props = {
   workspaces: any
   agencyId: string
   workspaceId: string
   
}
export const CreateFromTemplateInWorkspaceBtn = ({ agencyId, workspaces, workspaceId}: Props) => {
    const {setOpen} = useModal()

    const handleCreateWorkspace = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document From this tempalte"
                subheading="Create a workspace for your documents"
            >
                
               
                <CreateDocFromTemplateWorkspaceForm workspaces={workspaces} agencyId={agencyId} workspaceId={workspaceId} />
            </CustomModal>
        )
    }

    return (
        <span onClick={handleCreateWorkspace}>Create From Template</span>
    )
}
