'use client'

import ContactUserForm from "@/components/forms/contact-user"
import CustomModal from "@/components/global/custom-modal"
import { Button } from "@/components/ui/button"
import { useModal } from "@/providers/modal-provider"

type Props = {
   subaccountId: string
}
export const CreateContactBnt = ({ subaccountId }: Props) => {
    const {setOpen} = useModal()

    const handleCreateContact = async () => {
        setOpen(
            <CustomModal 
                title="Create a contact"
                subheading="Contacts are like customers"
            >
                <ContactUserForm subaccountId = {subaccountId}/>
            </CustomModal>
        )
    }

    return (
        <Button onClick={handleCreateContact}>Create Contact</Button>
    )
}
