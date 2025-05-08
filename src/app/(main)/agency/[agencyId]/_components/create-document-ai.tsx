'use client'

import CreateDocumentForm from "@/components/forms/create-document-form"
import CustomModal from "@/components/global/custom-modal"
import { useModal } from "@/providers/modal-provider"
import { Sparkle } from "lucide-react"

type Props = {
   workspaceId: string
   useAi: boolean
   agencyId: string
}
export const CreateDocumentAiBnt = ({ workspaceId, useAi, agencyId }: Props) => {
    const {setOpen} = useModal()

    const handleCreateDocument = async () => {
        setOpen(
            <CustomModal 
                title="Create a Document With AI"
                subheading="Create a workspace for your documents"
            >
                <CreateDocumentForm  useAi={useAi} workspaceId={workspaceId} type='Document'/>
                
            </CustomModal>
        )
    }

    return (
        <span onClick={handleCreateDocument}><div className="flex items-center"><Sparkle className="text-primary" size={15}/><span className="ml-2">Create With AI</span></div></span>
    )
}
