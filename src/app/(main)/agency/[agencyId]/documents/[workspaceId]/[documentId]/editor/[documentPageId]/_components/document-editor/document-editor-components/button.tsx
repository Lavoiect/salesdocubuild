import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import Link from 'next/link'
import React, { CSSProperties } from 'react'
import { Button } from "@/components/ui/button"

type Props = {
  element: EditorElement
}

const ButtonComponent = (props: Props) => {
  const { dispatch, state } = useWebEditor()

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const styles = props.element.styles as CSSProperties & { hover?: string }
  const content = props.element.content
  const bgColor = !Array.isArray(content) ? content.bgColor || styles?.backgroundColor || '#000' : styles?.backgroundColor || '#000'
  const hoverColor = !Array.isArray(content) ? content.hoverColor || '' : ''

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  return (
    <div
      draggable={!state.editor.liveMode}
      onDragStart={(e) => handleDragStart(e, 'button')}
      onClick={handleOnClickBody}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all',
        {
          '!border-blue-500': state.editor.selectedElement.id === props.element.id,
          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
        <Badge className='absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg'>
          {state.editor.selectedElement.name}
        </Badge>
      )}

      {(!Array.isArray(content) && (state.editor.previewMode || state.editor.liveMode)) && (
        <Button
          asChild
          style={{ backgroundColor: bgColor, ...styles }}
          onMouseEnter={(e) => {
            if (hoverColor) {
              e.currentTarget.style.backgroundColor = hoverColor
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = bgColor
          }}
        >
          <Link href={content.href || '#'}>
            {content.innerText || 'Button Text'}
          </Link>
        </Button>
      )}

      {!state.editor.previewMode && !state.editor.liveMode && (
        <div>
          {!Array.isArray(content) && (
            <div
              className='text-white py-2 px-4 rounded p-4'
              contentEditable
              suppressContentEditableWarning
              style={{ backgroundColor: bgColor, ...styles }}
              onMouseEnter={(e) => {
                if (hoverColor) {
                  e.currentTarget.style.backgroundColor = hoverColor
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = bgColor
              }}
              onBlur={(e) => {
                const newText = e.currentTarget.innerText

                if (newText.trim() === '') {
                  handleDeleteElement()
                  return
                }

                dispatch({
                  type: 'UPDATE_ELEMENT',
                  payload: {
                    elementDetails: {
                      ...props.element,
                      content: {
                        ...content,
                        innerText: newText,
                      },
                    },
                  },
                })
              }}
            >
              {content.innerText || 'Button Text'}
            </div>
          )}
        </div>
      )}

      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
        <div className='absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white'>
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

export default ButtonComponent
