'use client'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import RecursiveElement from './recursive'

import { v4 } from 'uuid'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { Trash } from 'lucide-react'

type Props = {
  element: EditorElement
  index?: number
}

const ThreeColumns = (props: Props) => {
  const { id, content, type } = props.element
  const { dispatch, state } = useWebEditor()

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation()
    const componentType = e.dataTransfer.getData('componentType') as EditorBtns
    switch (componentType) {
      case 'text':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: 'Text Component' },
              id: v4(),
              name: 'Text',
              styles: {
                color: 'black',
                ...defaultStyles,
              },
              type: 'text',
            },
          },
        })
        break
      case 'container':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: 'Container',
              styles: { ...defaultStyles },
              type: 'container',
            },
          },
        })
        break
      case '3Col':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: 'Three Columns',
              styles: { ...defaultStyles },
              type: '3Col',
            },
          },
        })
        break
    }

  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === '__body') return
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

  return (
    <div
  className={clsx(
    'relative p-4 transition-all',
    {
      'h-fit': type === 'container',
      'h-full': type === '__body',
      'm-4': type === 'container',
      '!border-blue-500': state.editor.selectedElement.id === props.element.id && !state.editor.liveMode,
      '!border-solid': state.editor.selectedElement.id === props.element.id && !state.editor.liveMode,
      'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
    }
  )}
  style={props.element.styles}
  id="innerContainer"
  onDrop={(e) => handleOnDrop(e, id)}
  onDragOver={handleDragOver}
  draggable={type !== '__body' && !state.editor.liveMode}
  onClick={handleOnClickBody}
  onDragStart={(e) => handleDragStart(e, 'container')}
>
  {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
      {state.editor.selectedElement.name}
    </Badge>
  )}

  <div className="flex w-full gap-4">
    {[0, 1, 2].map((colIndex) => (
      <div key={colIndex} className="flex-1 flex flex-col gap-2">
        {Array.isArray(content) &&
          content
            .filter((_, i) => i % 3 === colIndex)
            .map((childElement) => (
              <React.Fragment key={childElement.id}>
              <RecursiveElement
                key={childElement.id}
                element={childElement}
                parentId={id}
              />
            </React.Fragment>
            ))}
      </div>
    ))}
    {state.editor.selectedElement.id === id &&
        !state.editor.liveMode &&
        type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg flex gap-1 items-center">
            <Trash size={16} onClick={handleDeleteElement} />
            
          </div>
        )}
  </div>
</div>

  )
}

export default ThreeColumns