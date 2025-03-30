'use client'

import TextEditor from "@/components/editor/text-editor"
import { Badge } from "@/components/ui/badge"
import { EditorElement, useWebEditor } from "@/providers/editor/editor-provider"
import { EditorContent } from "@tiptap/react"
import clsx from "clsx"
import { Trash } from "lucide-react"
import React, { useEffect, useState } from "react"


type Props = {
    element: EditorElement
    myContent?: string
    
}


const TextComponent = ({element} : Props) => {
    const [myContent, setContent] = useState("");


    const {dispatch,state} = useWebEditor()

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: {elementDetails: element}
        })
    }

    const styles = element.styles

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {elementDetails: element}
        })
    }

    return (
        <div
            style={styles}
            draggable = {false}
            className={clsx(
                'p-[2px] !w-full m-[5px] relative text-[16px] transition-all',
                {
                  '!border-blue-500':
                    state.editor.selectedElement.id === element.id,
        
                  '!border-solid': state.editor.selectedElement.id === element.id,
                  'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
                }
              )}
              onClick={handleOnClickBody}
        >
            {state.editor.selectedElement.id === element.id && 
                !state.editor.liveMode && (
                    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
                        {state.editor.selectedElement.name} 
                    </Badge>
                )
            }

            
            
                
            {!Array.isArray(element.content) && 
                <div>
                     {(state.editor.liveMode || state.editor.previewMode) && (
                        <div dangerouslySetInnerHTML={{ __html: element.content.innerText || '' }}/>  
                )}
                    {(!state.editor.liveMode && !state.editor.previewMode) && (
                        <TextEditor content={element.content.innerText} />
                        )}
                    
            
                    
                </div>
               
           }

           
           
            {state.editor.selectedElement.id === element.id && 
            !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash 
                        className="cursor-pointer"
                        size={16}
                        onClick={handleDeleteElement}
                    />
                </div>
            )}
        </div>
    )
}

export default TextComponent
