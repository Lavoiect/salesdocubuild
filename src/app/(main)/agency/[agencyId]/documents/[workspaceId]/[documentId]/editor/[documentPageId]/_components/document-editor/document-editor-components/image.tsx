'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { ArrowUp, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    element: EditorElement
    index?: number
}

const ImageComponent = (props: Props) => {
    const {dispatch, state} = useWebEditor()
    const styles = props.element.styles

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if(type === null) return
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element
            }
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {elementDetails: props.element}
        })
    }

   
  return (
    <div 
        style={styles}
        draggable
        onDragStart={(e) => handleDragStart(e, 'image')}
        onClick={handleOnClick}
        className={clsx(
            'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
            {
                '!border-blue-500' :
                state.editor.selectedElement.id === props.element.id,

                '!border-solid' : state.editor.selectedElement.id === props.element.id,
                'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            }
        )}
    >
        {state.editor.selectedElement.id === props.element.id && 
            !state.editor.liveMode && (
                <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
                    {state.editor.selectedElement.name} + {props.index}
                </Badge>
            ) }
        
        {state.editor.selectedElement.id === props.element.id && 
            !state.editor.liveMode && (
                <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'> 
                    <Trash 
                        className='cursor-pointer'
                        size={16}
                        onClick={handleDeleteElement}
                    />
                   
                    
                </div>
            )
            }

            {!Array.isArray(props.element.content) && (
                <img 
                    className='!object-scale-down'
                    src={props.element.content.src || '/fallback-image.png'} 
                    alt={'Image'} 
                    width={typeof props.element.styles.width === 'string' ? parseInt(props.element.styles.width, 10) : props.element.styles.width || 560}
                    height={typeof props.element.styles.height === 'string' ? parseInt(props.element.styles.height, 10) : props.element.styles.height || 315}
                />
            )}
            
           
    </div>
  )
}

export default ImageComponent