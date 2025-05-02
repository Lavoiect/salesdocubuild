'use client'

import { Button } from "@/components/ui/button"
import { getDocumentPageDetails} from "@/lib/queries"
import { useWebEditor } from "@/providers/editor/editor-provider"
import clsx from "clsx"
import { EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import Recursive from "./document-editor-components/recursive"
import { ScrollArea } from "@/components/ui/scroll-area"
import ExportButton from "../export-pdf-btn"


type Props = {
    documentPageId:string
    liveMode?: boolean
    docName?: string
}
const FunnelEditor = ({documentPageId, liveMode}: Props) => {
    const {dispatch, state} = useWebEditor()

    useEffect(() => {
        if(liveMode){
            dispatch({
                type: 'TOGGLE_LIVE_MODE',
                payload: {value: true}
            })
        }
    }, [liveMode])

    //Make this more performant

    useEffect(() =>{
        const fetchData = async () => {
            const res = await getDocumentPageDetails(documentPageId)
            if(!res)return
            setDocName(res.name)
            dispatch({
                type: 'LOAD_DATA',
                payload: {
                    elements: res.content ? JSON.parse(res?.content) : '',
                    withLive: !!liveMode
                },
            })
        } 
        fetchData()
    }, [documentPageId])

    const [docName, setDocName] = useState<string>('')

   

    const handleClick = () => {
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: { elementDetails: null }
        })
    }
    const handleUnpreview = () => {
        dispatch({
            type: 'TOGGLE_PREVIEW_MODE'
        })
        dispatch({
            type: 'TOGGLE_LIVE_MODE'
        })
    }
    return (
        <ScrollArea 
        className={clsx(
            'p-4 use-automation-zoom-in h-full overflow-auto mr-[385px] bg-background transition-all rounded-md mt-28 pb-28',
            {
              '!p-0 !mr-0 mt-0 prose !max-w-full':
                state.editor.previewMode === true || state.editor.liveMode === true,
              '!w-[850px]': state.editor.device === 'Tablet',
              '!w-[420px]': state.editor.device === 'Mobile',
              '!w-full': state.editor.device === 'Desktop',
            }
          )}
          onClick={handleClick}>
        <div 
        
        > 
            {state.editor.previewMode && state.editor.liveMode && (
                <div className="flex items-center justify-between w-full fixed top-0 left-0 z-[100]">
                    <div className="flex justify-between w-full">
                        <Button 
                            variant={'ghost'}
                            size={'icon'}
                            className="flex w-6 m-3 h-6 bg-slate-600 p-[2px] "
                            onClick={handleUnpreview}
                        >
                            <EyeOff/>
                        </Button>
                        <div className="flex ml-auto  m-3">
                            <ExportButton docName={docName}/>
                        </div>
                    </div>
                    
               
                </div>
                
            )}
            {Array.isArray(state.editor.elements) && 
                state.editor.elements.map((childElement) => <Recursive key={childElement.id} element={childElement}/>)}
           
        </div>
        </ScrollArea>
    )
}

export default FunnelEditor
