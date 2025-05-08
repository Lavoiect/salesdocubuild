'use client'

import { useModal } from "@/providers/modal-provider";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";
import UploadMediaForm from "../forms/upload-media";


type Props = {
    agencyId: string;
}
export const MediaUploadButton = ({ agencyId }: Props) => {
    const {isOpen, setOpen, setClose} = useModal()

    return (
        <Button 
            onClick={() => {
                setOpen(
                    <CustomModal 
                        title="Upload Media"
                        subheading="Upload a file to your media bucket"
                    >
                        <UploadMediaForm agencyId={agencyId}></UploadMediaForm>
                    </CustomModal>
                )
            }}
        >UpLoad</Button>
    )
}
