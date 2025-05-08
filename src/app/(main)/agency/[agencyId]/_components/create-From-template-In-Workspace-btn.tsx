'use client'

import CreateDocFromTemplateWorkspaceForm from "@/components/forms/create-doc-from-Template-workspace"
import CustomModal from "@/components/global/custom-modal"
import { useModal } from "@/providers/modal-provider"

type Props = {
   workspaces: any
   agencyId: string
   workspaceId: string
   type: string
}
export const CreateFromTemplateInWorkspaceBtn = ({ agencyId, workspaces, workspaceId, type}: Props) => {
    const {setOpen} = useModal()

    const handleCreateWorkspace = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document From this tempalte"
                subheading="Create a workspace for your documents"
            >
                
               
                <CreateDocFromTemplateWorkspaceForm workspaces={workspaces} agencyId={agencyId} workspaceId={workspaceId} type={type} />
            </CustomModal>
        )
    }

    return (
        <span onClick={handleCreateWorkspace}>Create From Template</span>
    )
}
