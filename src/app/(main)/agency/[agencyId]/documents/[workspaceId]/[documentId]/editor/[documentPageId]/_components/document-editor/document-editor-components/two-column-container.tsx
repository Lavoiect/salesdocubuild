'use client'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import React from 'react'
import RecursiveElement from './recursive'

import { v4 } from 'uuid'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'

type Props = {
  element: EditorElement
  index?: number
}

const TwoColumns = (props: Props) => {
  const { id, content, type } = props.element
  const { dispatch, state } = useWebEditor()

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
      case '2Col':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: 'Two Columns',
              styles: { ...defaultStyles },
              type: '2Col',
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
      style={props.element.styles}
      className={clsx('relative p-4 transition-all', {
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'm-4': type === 'container',
        '!border-blue-500':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        '!border-solid':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== '__body' && !state.editor.liveMode}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'container')}
    >
     
      {Array.isArray(content) &&
        content.map((childElement) => (
          <RecursiveElement
            key={childElement.id}
            element={childElement}
          />
        ))}
    </div>
  )
}

export default TwoColumns