import { EditorBtns } from '@/lib/constants'
import { Link, RectangleEllipsis } from 'lucide-react'
import React from 'react'

type Props = {}


const ButtonPlaceholder = (props: Props) => {
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if(type === null) return
        e.dataTransfer.setData('componentType', type)
        
    }
  return (
    <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'button')}
        className='p-2 text-muted-foreground h-10 w-10 bg-gray-100 group-hover:text-primary group-hover:bg-purple-100 rounded-full'
    >
        <RectangleEllipsis />
    </div>
  )
}

export default ButtonPlaceholder