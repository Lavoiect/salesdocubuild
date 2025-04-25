'use client'

import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React, { useState } from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { ArrowDown, ArrowUp, Trash } from 'lucide-react'
import { findParentContainerId } from '@/lib/utils' // adjust this path

type Props = {
  element: EditorElement
  index?: number
  parentId?: string
}

const ThreeColumn = ({ element, index, parentId }: Props) => {
  const { id, content, name, styles, type } = element
  const { dispatch, state } = useWebEditor()
  const [dragOver, setDragOver] = useState(false)

  const handleDragLeave = () => setDragOver(false)

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleOnDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)


    const dragType = e.dataTransfer.getData('dragType')
    const draggedElementId = e.dataTransfer.getData('elementId')
    
    if (dragType === 'REORDER' && draggedElementId) {
      dispatch({
        type: 'REORDER_ELEMENTS',
        payload: {
          sourceElementId: draggedElementId,
          targetContainerId: id,
          targetIndex // Start with 0 or calculate based on drop zone
        },
      })
      return
    }

    const componentType = e.dataTransfer.getData('componentType') as EditorBtns

    const basePayload = {
      containerId: id,
      elementDetails: {
        id: v4(),
        styles: { ...defaultStyles },
      },
    }

    switch (componentType) {
      case 'text':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Text',
              type: 'text',
              content: { innerText: 'Text Element' },
              styles: { ...defaultStyles, color: 'black' },
            },
          },
        })
        break
      case 'link':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Link',
              type: 'link',
              content: { innerText: 'Link Element', href: '#' },
              styles: { ...defaultStyles, color: 'black' },
            },
          },
        })
        break
      case 'button':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Button',
              type: 'button',
              content: {

                innerText: 'Click me',
                href: '#',
                bgColor: '#4F46E5',
                hoverColor: '#4338CA',
              },
            },
          },
        })
        break
      case 'container':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Container',
              type: 'container',
              content: [],
            },
          },
        })
        break
      case '2Col':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Two Columns',
              type: '2Col',
              content: [
                { ...basePayload.elementDetails, id: v4(), type: 'container', name: 'Column 1', content: [], styles: { ...defaultStyles, width: '100%' } },
                { ...basePayload.elementDetails, id: v4(), type: 'container', name: 'Column 2', content: [], styles: { ...defaultStyles, width: '100%' } },
              ],
              styles: { ...defaultStyles, display: 'flex' },
            },
          },
        })
        break
      case '3Col':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Three Columns',
              type: '3Col',
              content: new Array(3).fill(null).map((_, i) => ({
                id: v4(),
                name: `Column ${i + 1}`,
                type: 'container',
                content: [],
                styles: { ...defaultStyles, width: '100%' },
              })),
              styles: { ...defaultStyles, display: 'flex-1' },
            },
          },
        })
        break
      case 'contactForm':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Contact Form',
              type: 'contactForm',
              content: [],
            },
          },
        })
        break
      case 'video':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Video',
              type: 'video',
              content: {
                src: 'https://www.youtube.com/watch?v=uhUht6vAsMY',
              },
            },
          },
        })
        break
      case 'image':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            ...basePayload,
            elementDetails: {
              ...basePayload.elementDetails,
              name: 'Image',
              type: 'image',
              content: {
                src: '/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F23a72a29-5791-4e97-9608-08f4f46e367b-jmarfk.png&w=3840&q=75"',
              },
            },
          },
        })
        break
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragStart = (e: React.DragEvent) => {
    if (type === '__body') return
    e.stopPropagation()

    const sourceContainerId = findParentContainerId(state.editor.elements, id)

    e.dataTransfer.setData('dragType', 'REORDER')
    e.dataTransfer.setData('elementId', id)
    e.dataTransfer.setData('sourceContainerId', sourceContainerId ?? '')
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: { elementDetails: element },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: element },
    })
  }

  const moveItem = (direction: 'up' | 'down') => {
    const parent = state.editor.elements.find(
      (el) =>
        Array.isArray(el.content) && el.content.some((child) => child.id === id)
    )

    if (!parent || !Array.isArray(parent.content)) return

    const currentIndex = parent.content.findIndex((child) => child.id === id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= parent.content.length) return

    const newContent = [...parent.content]
    ;[newContent[currentIndex], newContent[newIndex]] = [
      newContent[newIndex],
      newContent[currentIndex],
    ]

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...parent,
          content: newContent,
        },
      },
    })

    dispatch({ type: 'REFRESH_EDITOR_STATE' })
  }

  return (
    <div
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': ['container', '2Col', '3Col'],
        'h-fit': type === 'container',
        'h-full overflow-scroll': type === '__body',
        'flex flex-col md:flex-row': type === '2Col',
        'flex flex-col lg:flex-row': type === '3Col',
        '!object-scale-down': type === 'image',
        '!block':
          (state.editor.device === 'Mobile' && ['2Col', '3Col']) ||
          (state.editor.device === 'Tablet' && type === '3Col'),
        '!border-blue-500':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== '__body',
        '!border-primary !border-4':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === '__body',
        '!border-solid':
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        '!bg-purple-100': dragOver,
      })}
      onDrop={(e) => handleOnDrop(e, 0)}
      onDragOver={handleDragOver}
      onClick={handleOnClickBody}
      onDragLeave={handleDragLeave}
      draggable={
        type !== '__body' && !state.editor.liveMode && !state.editor.previewMode
      }
      onDragStart={handleDragStart}
    >
      <Badge
        className={clsx(
          'absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden',
          {
            block:
              state.editor.selectedElement.id === id && !state.editor.liveMode,
          }
        )}
      >
        {name}
      </Badge>

      
      <div className="flex w-full gap-4">
    {[0, 1, 2].map((colIndex) => (
      <div key={colIndex} className="flex-1 flex flex-col gap-2">
        {Array.isArray(content) &&
          content
            .filter((_, i) => i % 3 === colIndex)
            .map((childElement) => (
              <React.Fragment key={childElement.id}>
              <Recursive
                key={childElement.id}
                element={childElement}
                parentId={id}
              />
            </React.Fragment>
            ))}
      </div>
    ))}
  </div>
     

      {state.editor.selectedElement.id === id &&
        !state.editor.liveMode &&
        type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg flex gap-1 items-center">
            <Trash size={16} onClick={handleDeleteElement} />
            <ArrowUp size={16} onClick={() => moveItem('up')} />
            <ArrowDown size={16} onClick={() => moveItem('down')} />
          </div>
        )}
        <div onDragOver={allowDrop} onDrop={(e) => handleOnDrop(e, Array.isArray(content) ? content.length : 0)} />

    </div>
    
  )
}

export default ThreeColumn
