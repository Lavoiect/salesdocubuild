'use client'
import { toast } from '@/components/ui/use-toast'
import { deleteDocument } from '@/lib/queries'
import { ro } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react'
import React from 'react'

type Props = {
    documentId: string
}

const DeleteDocumentBtn = (props: Props) => {
    const router = useRouter()
    
    const handleDelete = (id: string) => () => {
        deleteDocument(id)
       toast({
                       title: 'Success',
                       description: 'Saved document details'
                   })
                   router.refresh()
   }
  return (
    <Trash className='text-red-500' onClick={handleDelete(props.documentId)} />
  )
}

export default DeleteDocumentBtn