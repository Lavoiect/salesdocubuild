import { EditorBtns } from '@/lib/constants'
import { TextSelect, TypeIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const TextPlaceholder = (props: Props) => {
    const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
        if(type === null) return
        e.dataTransfer.setData('componentType', type)
    }
  return (
    <div
        draggable
        onDragStart={(e) => {
            handleDragState(e, 'text')
        }}
        className='p-2 text-muted-foreground h-10 w-10 bg-gray-100 group-hover:text-primary group-hover:bg-purple-100 rounded-full'
    >
        <TextSelect />
    </div>
  )
}

export default TextPlaceholder