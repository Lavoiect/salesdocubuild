'use client'

import CreateDocumentForm from "@/components/forms/create-document-form"
import CreateTemplateForm from "@/components/forms/create-template-form"
import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"

type Props = {
   agencyId: string
}
export const CreateTemplatetBnt = ({ agencyId }: Props) => {
    const {setOpen} = useModal()

    const handleCreateTemplate = async () => {
        setOpen(
            <CustomModal 
                title="Create a Template"
                subheading="Create a workspace for your documents"
            >
                <CreateTemplateForm agencyId={agencyId}/>
            </CustomModal>
        )
    }

    return (
        <Button className="hover:bg-fuchsia-300" onClick={handleCreateTemplate}>Create a Template Group</Button>
    )
}
