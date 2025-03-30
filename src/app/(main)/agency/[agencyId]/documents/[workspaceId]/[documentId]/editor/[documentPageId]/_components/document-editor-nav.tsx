'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { saveActivityLogsNotification, upsertDocumentPage } from "@/lib/queries"
import { DeviceTypes, useWebEditor } from "@/providers/editor/editor-provider"
import { DocumentPage } from "@prisma/client"
import clsx from "clsx"
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FocusEventHandler, useEffect } from "react"
import { toast } from "sonner"

type Props = {
    documentId: string
    documentPageDetails: DocumentPage
    workspaceId: string
}

const FunnelEditorNav = ({
    documentId,
    documentPageDetails,
    workspaceId
}: Props ) => {
    const router = useRouter()
    const {state, dispatch} = useWebEditor()

    useEffect(() => {
        dispatch({
          type: 'SET_FUNNELPAGE_ID',
          payload: { funnelPageId: documentPageDetails.id },
        })
      }, [documentPageDetails])

      const handlePreviewClick = () => {
        dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
        dispatch({ type: 'TOGGLE_LIVE_MODE' })
      }
    

      const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
        event
      ) => {
        if (event.target.value === documentPageDetails.name) return
        if (event.target.value) {
          await upsertDocumentPage(
            
            {
              id: documentPageDetails.id,
              name: event.target.value,
              order: documentPageDetails.order,
            },
            documentId
          )
    
          toast('Success', {
            description: 'Saved Funnel Page title',
          })
          router.refresh()
        } else {
          toast('Oppse!', {
            description: 'You need to have a title!',
          })
          event.target.value = documentPageDetails.name
        }
      }

      const handleUndo = () => {
        dispatch({ type: 'UNDO' })
      }
    
      const handleRedo = () => {
        dispatch({ type: 'REDO' })
      }

      const handleOnSave = async () => {
        const content = JSON.stringify(state.editor.elements)
        try {
          const response = await upsertDocumentPage(
            
            {
              ...documentPageDetails,
              content,
            },
            documentId
          )
          await saveActivityLogsNotification({
            agencyId: undefined,
            description: `Updated a funnel page | ${response?.name}`,
            //workspaceId: subaccountId,
          })
          toast('Success', {
            description: 'Saved Editor',
          })
        } catch (error) {
          toast('Oppse!', {
            description: 'Could not save editor',
          })
        }
      }

    return(
       <TooltipProvider>
            <nav 
                className={clsx(
                    'border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all fixed top-0 left-0 right-0 z-[10] bg-background',
                    {'!h-0 !p-0 !overflow-hidden' : state.editor.previewMode}
                )}
            >
                <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
                    <Link href={`/agency`}>
                    <ArrowLeftCircle/>
                    </Link>
                    <div className="flex flex-col w-full">
                        <Input 
                            defaultValue={documentPageDetails.name}
                            className="border-none h-5 m-0 p-0 text-lg"
                            onBlur={handleOnBlurTitleChange}
                        />
                        <span className="text-sm text-muted-foreground">Path: /{documentPageDetails.pathName}</span>
                    </div>
                </aside>
                <aside>
                <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: 'CHANGE_DEVICE',
                payload: { device: value as DeviceTypes },
              })
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
                </aside>
                <aside className="flex items-center gap-2">
          <Button
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
                disabled
                defaultChecked={true}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              Last updated {documentPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>

            </nav>
       </TooltipProvider>
    )
}

export default FunnelEditorNav