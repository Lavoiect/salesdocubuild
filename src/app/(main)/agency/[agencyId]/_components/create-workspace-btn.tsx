'use client'

import CreateWorkspaceForm from "@/components/forms/create-workspace-form"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"

type Props = {
   agencyId: string
}
export const CreateWorkspacetBnt = ({ agencyId }: Props) => {
    const {setOpen} = useModal()

    const handleCreateWorkspace = async () => {
        setOpen(
            <CustomModal 
                title="Create a Workspace"
                subheading="Create a workspace for your documents"
            >
                <CreateWorkspaceForm agencyId={agencyId} />
            </CustomModal>
        )
    }

    return (
        <Button className="hover:bg-fuchsia-300" onClick={handleCreateWorkspace}>Create Workspace</Button>
    )
}
