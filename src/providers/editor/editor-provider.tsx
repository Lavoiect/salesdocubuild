'use client'
import { EditorBtns } from '@/lib/constants'
import { Dispatch, createContext, useContext, useReducer } from 'react'
import { DocumentPage } from '@prisma/client'
import { number } from 'zod'

export type DeviceTypes = 'Desktop' | 'Mobile' | 'Tablet'

export type EditorElement = {
  id: string
  position?: number
  styles: React.CSSProperties
  name: string
  type: EditorBtns
  content: EditorElement[] | { href?: string; innerText?: string; src?: string; 
    
     bgColor?:string;
     textColor?:string;
     hoverColor?:string;
  
}
}

export type EditorAction =
  | { type: 'ADD_ELEMENT'; payload: { containerId: string; elementDetails: EditorElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { elementDetails: EditorElement } }
  | { type: 'DELETE_ELEMENT'; payload: { elementDetails: EditorElement } }
  | { type: 'CHANGE_CLICKED_ELEMENT'; payload: { elementDetails: EditorElement | null } }
  | { type: 'CHANGE_DEVICE'; payload: { device: DeviceTypes } }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'TOGGLE_LIVE_MODE'; payload?: { value: boolean } }
  | { type: 'REDO' }
  | { type: 'UNDO' }
  | { type: 'LOAD_DATA'; payload: { elements?: EditorElement[]; withLive?: boolean } }
  | { type: 'SET_FUNNELPAGE_ID'; payload: { funnelPageId: string } }
  | { type: 'REFRESH_EDITOR_STATE' }
  | { type: 'REORDER_ELEMENTS'; payload: { sourceElementId: string; targetContainerId: string; targetIndex: number } }
  | { type: 'SET_DOCUMENT_ID'; payload: { documentId: string } }



export type Editor = {
  liveMode: boolean
  elements: EditorElement[]
  selectedElement: EditorElement
  device: DeviceTypes
  previewMode: boolean
  documentPageId: string
  documentId: string
}

export type HistoryState = {
  history: Editor[]
  currentIndex: number
}

export type EditorState = {
  editor: Editor
  history: HistoryState
}

const initialEditorState: EditorState['editor'] = {
  elements: [
    {
      content: [],
      id: '__body',
      name: 'Body',
      styles: {},
      type: '__body',
    },
  ],
  selectedElement: {
    id: '',
    content: [],
    name: '',
    styles: {},
    type: null,
  },
  device: 'Desktop',
  previewMode: false,
  liveMode: false,
  documentPageId: '',
  documentId: ''
}

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
}

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
}

const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== 'ADD_ELEMENT')
    throw Error(
      'You sent the wrong action type to the Add Element editor State'
    )
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      }
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      }
    }
    return item
  })
}

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== 'UPDATE_ELEMENT') {
    throw Error('You sent the wrong action type to the update Element State')
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails }
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      }
    }
    return item
  })
}

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== 'DELETE_ELEMENT')
    throw Error(
      'You sent the wrong action type to the Delete Element editor State'
    )
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action)
    }
    return true
  })
}

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
): EditorState => {
  switch (action.type) {

    case 'REORDER_ELEMENTS': {
      const { sourceElementId, targetContainerId, targetIndex } = action.payload
    
      const elements = [...state.editor.elements]
    
      const findAndRemoveElement = (container: EditorElement): [EditorElement | null, boolean] => {
        if (!Array.isArray(container.content)) return [null, false]
    
        const index = container.content.findIndex((el) => el.id === sourceElementId)
        if (index !== -1) {
          const [removed] = container.content.splice(index, 1)
          return [removed, true]
        }
    
        for (const child of container.content) {
          const [removed, found] = findAndRemoveElement(child)
          if (found) return [removed, true]
        }
    
        return [null, false]
      }
    
      const findAndInsertElement = (
        container: EditorElement,
        element: EditorElement,
        index: number | undefined
      ): boolean => {
        if (container.id === targetContainerId && Array.isArray(container.content)) {
          if (typeof index === 'number') {
            container.content.splice(index, 0, element)
          } else {
            container.content.push(element)
          }
          return true
        }
    
        if (Array.isArray(container.content)) {
          for (const child of container.content) {
            const inserted = findAndInsertElement(child, element, index)
            if (inserted) return true
          }
        }
      
        return false
      }
    
      
    
      let removedElement: EditorElement | null = null
    
      for (const el of elements) {
        const [found, wasRemoved] = findAndRemoveElement(el)
        if (wasRemoved) {
          removedElement = found
          break
        }
      }
    
      if (!removedElement) return state
    
      for (const el of elements) {
        const inserted = findAndInsertElement(el, removedElement, targetIndex)
        if (inserted) break
      }
    
      return {
        ...state,
        editor: {
          ...state.editor,
          elements,
        },
      }
    }
    
    
    
    case 'ADD_ELEMENT':
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      }
      // Update the history to include the entire updated EditorState
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState }, // Save a copy of the updated state
      ]

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      }

      return newEditorState

      // editor-reducer.ts or editor-provider.ts (your reducer)



    case 'REFRESH_EDITOR_STATE':
      // Force a state refresh by returning a new reference
      // Trigger a state refresh by returning a new reference
      return { ...state, editor: { ...state.editor } };

    case 'UPDATE_ELEMENT':
      // Perform your logic to update the element in the state
      const updatedElements = updateAnElement(state.editor.elements, action)

      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: '',
              content: [],
              name: '',
              styles: {},
              type: null,
            },
      }

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
      ]
      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      }
      return updatedEditor

    case 'DELETE_ELEMENT':
      // Perform your logic to delete the element from the state
      const updatedElementsAfterDelete = deleteAnElement(
        state.editor.elements,
        action
      )
      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      }
      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete }, // Save a copy of the updated state
      ]

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      }
      return deletedState

    case 'CHANGE_CLICKED_ELEMENT':
      const clickedState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: '',
            content: [],
            name: '',
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor }, // Save a copy of the current editor state
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      }
      return clickedState
    case 'CHANGE_DEVICE':
      const changedDeviceState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      }
      return changedDeviceState

     
    case 'TOGGLE_PREVIEW_MODE':
      const toggleState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      }
      return toggleState

    case 'TOGGLE_LIVE_MODE':
      const toggleLiveMode: EditorState = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      }
      return toggleLiveMode

    case 'REDO':
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1
        const nextEditorState = { ...state.history.history[nextIndex] }
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        }
        return redoState
      }
      return state

    case 'UNDO':
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1
        const prevEditorState = { ...state.history.history[prevIndex] }
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        }
        return undoState
      }
      return state

    case 'LOAD_DATA':
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      }

    case 'SET_FUNNELPAGE_ID':
      const { funnelPageId } = action.payload
      const updatedEditorStateWithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      }

      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId }, // Save a copy of the updated state
      ]

      const funnelPageIdState = {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        },
      }
      return funnelPageIdState
  
      case 'SET_DOCUMENT_ID':
      return {
        ...state,
        editor: {
          ...state.editor,
          documentId: action.payload.documentId,
        },
      }


    default:
      return state
  }
}

export type EditorContextData = {
  device: DeviceTypes
  previewMode: boolean
  setPreviewMode: (previewMode: boolean) => void
  setDevice: (device: DeviceTypes) => void
}

export const EditorContext = createContext<{
  state: EditorState
  dispatch: Dispatch<EditorAction>
  workspaceId: string
  documentId: string
  pageDetails: DocumentPage | null
}>({
  state: initialState,
  dispatch: () => undefined,
  workspaceId: '',
  documentId: '',
  pageDetails: null,
})

type EditorProps = {
  children: React.ReactNode
  workspaceId: string
  documentId: string
  pageDetails: DocumentPage
}

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        workspaceId: props.workspaceId,
        documentId: props.documentId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export const useWebEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor Hook must be used within the editor Provider')
  }
  return context
}

export default EditorProvider