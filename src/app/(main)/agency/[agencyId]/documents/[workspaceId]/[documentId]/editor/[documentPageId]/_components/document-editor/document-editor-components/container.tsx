'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useWebEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { ArrowDown, ArrowUp, Trash } from 'lucide-react'
import { stat } from 'fs'
import { current } from 'tailwindcss/colors'

type EditorAction =
  | { type: 'ADD_ELEMENT'; payload: { containerId: string; elementDetails: EditorElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { elementDetails: EditorElement } }
  | { type: 'DELETE_ELEMENT'; payload: { elementDetails: EditorElement } }
  | { type: 'CHANGE_CLICKED_ELEMENT'; payload: { elementDetails: EditorElement } }
  | { type: 'REFRESH_EDITOR_STATE' }; // Add this line

type Props = { element: EditorElement
  index?: number
 }

const Container = ({ element, index }: Props) => {
  const { id, content, name, styles, type, position } = element
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
              content: { innerText: 'Text Element' },
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

      case 'link':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: { innerText: 'Link Element', href: '#' },
              id: v4(),
              name: 'Link',
              styles: {
                color: 'black',
                ...defaultStyles,
              },
              type: 'link',
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
              content: [
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
              ],
              id: v4(),
              name: 'Two Columns',
              styles: { ...defaultStyles, display: 'flex' },
              type: '2Col',
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
              content: [
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
                {
                  content: [],
                  id: v4(),
                  name: 'Container',
                  styles: { ...defaultStyles, width: '100%' },
                  type: 'container',
                },
              ],
              id: v4(),
              name: 'Three Columns',
              styles: { ...defaultStyles, display: 'flex' },
              type: '3Col',
            },
          },
        })
        break

          dispatch({
            type: 'ADD_ELEMENT',
            payload: {
              containerId: id,
              elementDetails: {
                content: [],
                id: v4(),
                name: 'Contact Form',
                styles: { ...defaultStyles },
                type: 'contactForm',
              },
            },
          })
          break
      
        case 'video':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: 'https://www.youtube.com/watch?v=uhUht6vAsMY'
              },
              id: v4(),
              name: 'Video',
              styles: {},
              type: 'video',
            },
          },
        })
        break

        case 'contactForm':
          dispatch({
            type: 'ADD_ELEMENT',
            payload: {
              containerId: id,
              elementDetails: {
                content: [],
                id: v4(),
                name: 'Contact Form',
                styles: {},
                type: 'contactForm',
              },
            },
          })
          break

          case 'image':
        dispatch({
          type: 'ADD_ELEMENT',
          payload: {
            containerId: id,
            elementDetails: {
              content: {
                src: '/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F23a72a29-5791-4e97-9608-08f4f46e367b-jmarfk.png&w=3840&q=75"',
              },
              id: v4(),
              name: 'Image',
              styles: {},
              type: 'image',
            },
          },
        })
      
     
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
        elementDetails: element,
      },
    })
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    })
  }

  const moveItemDown = () => {
    const parentElement = state.editor.elements.find((item) =>
      Array.isArray(item.content) &&
      item.content.some((i) => i.id === element.id)
    );

   // console.log(parentElement)

    if (parentElement && Array.isArray(parentElement.content)) {
      const index = parentElement.content.findIndex(
        (i) => i.id === element.id
      );

      if (index >= 0 && index < parentElement.content.length - 1) {
        const newContent = [...parentElement.content];

        [newContent[index], newContent[index + 1]] = [
          newContent[index + 1],
          newContent[index],
        ];
      // console.log(newContent)
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: {
            elementDetails: {
              ...parentElement,
              content: newContent, // Ensure a new reference for state refresh
            },
          },
        });

        dispatch({
          type: 'REFRESH_EDITOR_STATE', // Optional: Trigger a state refresh if needed
        });
       
      }
    }
    
    
  }
  const moveItemUp = () => {
    const parentElement = state.editor.elements.find((item) =>
      Array.isArray(item.content) &&
      item.content.some((i) => i.id === element.id)
    );

   // console.log(parentElement)

    if (parentElement && Array.isArray(parentElement.content)) {
      const index = parentElement.content.findIndex(
        (i) => i.id === element.id
      );

      if (index > 0) {
        const newContent = [...parentElement.content];

        [newContent[index], newContent[index - 1]] = [
          newContent[index - 1],
          newContent[index],
        ];
      // console.log(newContent)
        dispatch({
          type: 'UPDATE_ELEMENT',
          payload: {
            elementDetails: {
              ...parentElement,
              content: newContent, // Ensure a new reference for state refresh
            },
          },
        });

        dispatch({
          type: 'REFRESH_EDITOR_STATE', // Optional: Trigger a state refresh if needed
        });
       
      }
    }
    
    
  }

  return (
    <div
      style={styles}
      className={clsx('relative p-4 transition-all group', {
        'max-w-full w-full': type === 'container' || type === '2Col',
        'h-fit ': type === 'container',
        'h-full': type === '__body',
        'overflow-scroll ': type === '__body',
        'flex flex-col md:!flex-row': type === '2Col',
        'flex flex-col lg:!flex-row': type === '3Col',
        '!object-scale-down': type === 'image',
        '!block': (state.editor.device === 'Mobile' && (type === '2Col' || type === '3Col')) ||
          (state.editor.device === 'Tablet' && type === '3Col'),
        '!border-blue-500':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type !== '__body',
        '!border-yellow-400 !border-4':
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          state.editor.selectedElement.type === '__body',
        '!border-solid':
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== '__body' && !state.editor.liveMode && !state.editor.previewMode}
      onClick={handleOnClickBody}
     onDragStart={(e) => handleDragStart(e, state.editor.selectedElement.type ?? '')}
    >
      <Badge
        className={clsx(
          'absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden',
          {
            block:
              state.editor.selectedElement.id === element.id &&
              !state.editor.liveMode,
          }
        )}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) &&
        content.map((childElement, index) => (
          <Recursive
            key={index}
            element={childElement}
            index={index}
          />
        ))}

      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              size={16}
              onClick={handleDeleteElement}
            />
             <ArrowUp
              size={16}
              onClick={moveItemUp}
            />
            <ArrowDown
              size={16}
              onClick={moveItemDown}
            />
          </div>
        )}
    </div>
  )
}

export default Container