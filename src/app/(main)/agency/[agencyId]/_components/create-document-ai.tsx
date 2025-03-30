'use client'

import CreateDocumentForm from "@/components/forms/create-document-form"
import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"
import { Sparkle } from "lucide-react"

type Props = {
   workspaceId: string
}
export const CreateDocumentAiBnt = ({ workspaceId }: Props) => {
    const {setOpen} = useModal()

    const handleCreateDocument = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document With AI"
                subheading="Create a workspace for your documents"
            >
                <CreateDocumentForm workspaceId={workspaceId}/>
            </CustomModal>
        )
    }

    return (
        <span onClick={handleCreateDocument}><div className="flex items-center"><Sparkle className="text-primary" size={15}/><span className="ml-2">Create With AI</span></div></span>
    )
}
