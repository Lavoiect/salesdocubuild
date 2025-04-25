import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { useWebEditor, EditorElement } from '@/providers/editor/editor-provider'
import { Trash } from 'lucide-react'
import Container from './container'
import { findParentContainerId } from '@/lib/utils'

type Props = {
  element: EditorElement
    parentId?: string
}

const LinkComponent = ({ element, parentId }: Props) => {
  const { state, dispatch } = useWebEditor()

  const isSelected = state.editor.selectedElement.id === element.id
  const styles = element.styles || {}

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element }
    })
  }
  
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.setData('dragType', 'REORDER')
    e.dataTransfer.setData('elementId', element.id)
    
    //const parentId = findParentContainerId(state.editor.elements, element.id)
    e.dataTransfer.setData('sourceContainerId', parentId || '')
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element
      }
    })
  }

  return (
    <div
      draggable={true}
      onClick={handleOnClick}
      onDragStart={handleDragStart}
      className={clsx(
        'p-[2px] w-full m-[5px] relative transition-all',
        {
          '!border-blue-500 border-solid': isSelected,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {isSelected && !state.editor.liveMode && (
        <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
          {element.name}
        </Badge>
      )}

      {/* Preview & Live Mode */}
      {(state.editor.previewMode || state.editor.liveMode) && (
        <Link
          href={Array.isArray(element.content) ? '#' : element.content?.href || '#'}
          style={styles}
         
          
          className='inline-block px-4 py-2 rounded transition-all'
        >
          {Array.isArray(element.content) ? 'Link' : element.content?.innerText || 'Link'}
        </Link>
      )}

      
      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
          contentEditable
          suppressContentEditableWarning
          className='inline-block px-4 py-2 rounded'
          style={styles}
          onBlur={(e) => {
            const text = e.currentTarget.innerText
            if (text.trim() === '') {
              handleDeleteElement()
              return
            }

            dispatch({
              type: 'UPDATE_ELEMENT',
              payload: {
                elementDetails: {
                  ...element,
                  content: {
                    ...element.content,
                    innerText: text,
                  },
                },
              },
            })
          }}
        >
          {typeof element.content === 'object' && !Array.isArray(element.content) 
            ? element.content.innerText || 'Link' 
            : 'Link'}
        </span>
      )}

      {isSelected && !state.editor.liveMode && (
        <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg text-white'>
          <Trash
            className='cursor-pointer'
            size={16}
            onClick={handleDeleteElement}
          />
        </div>
      )}
    </div>
  )
}

export default LinkComponent
