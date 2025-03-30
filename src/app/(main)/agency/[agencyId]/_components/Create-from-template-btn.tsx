'use client'

import CreateDocFromTemplateForm from "@/components/forms/create-doc-from-Template"
import CreateDocumentForm from "@/components/forms/create-document-form"
import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"
import { CopyPlusIcon } from "lucide-react"

type Props = {
   workspaces: any
   agencyId: string
   content: string
   
}
export const CreateFromTemplateBtn = ({ agencyId, workspaces, content}: Props) => {
    const {setOpen} = useModal()

    const handleCreateWorkspace = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document From this tempalte"
                subheading="Create a workspace for your documents"
            >
               
                <CreateDocFromTemplateForm workspaces={workspaces} agencyId={agencyId} content={content}/>
            </CustomModal>
        )
    }

    return (
        <Button variant={'ghost'} onClick={handleCreateWorkspace}><CopyPlusIcon/></Button>
    )
}
