import { EditorBtns } from '@/lib/constants'
import { Contact2Icon, TextCursorInput } from 'lucide-react'
import React from 'react'

type Props = {}


const ContactFormComponentPlaceholder = (props: Props) => {
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if(type === null) return
        e.dataTransfer.setData('componentType', type)
    }

  return (
    <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'contactForm')}
        className='p-2 text-muted-foreground h-10 w-10 bg-gray-100 group-hover:text-primary group-hover:bg-purple-100 rounded-full'
    >
        <TextCursorInput />
    </div>
  )
}

export default ContactFormComponentPlaceholder