'use client'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useWebEditor } from "@/providers/editor/editor-provider"
import clsx from "clsx"
import TabList from "./tabs"
import SettingsTab from "./tabs/settings-tab"
import MediaBucketTab from "./tabs/media-bucket-tab"
import ComponentsTab from "./tabs/component-tab"

type Props = {
   agencyId: string
}
const FunnelEditorSidebar = ({agencyId}: Props) => {
    const {state, dispatch} = useWebEditor()
    return (
       <Sheet
            open={true}
            modal={false}
       >
            <Tabs 
                className="w-full"
                defaultValue="Settings"
            >
                <SheetContent 
                    showX={false}
                    side='right'
                    className={clsx(
                        'mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden',
                        {hidden: state.editor.previewMode}
                    )}
                >
                    <TabList/>
                </SheetContent>
                <SheetContent 
                    showX={false}
                    side="right"
                    className={clsx(
                        'mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background transition-all overflow-hidden',
                        {hidden: state.editor.previewMode}
                    )}
                >
                    <div className="grid gap-4 h-full pb-36 overflow-scroll">
                        <TabsContent value="Settings">
                            <SheetHeader className="text-left p-6">
                                <SheetTitle>Styles</SheetTitle>
                                <SheetDescription>
                                    Show your creativy! you can customize every component as you like.
                                </SheetDescription>
                            </SheetHeader>
                            <SettingsTab/>
                        </TabsContent>
                        <TabsContent value="Media" className="">
                            <MediaBucketTab agencyId={agencyId}/>
                               
                        </TabsContent>
                        <TabsContent value="Components">
                            <SheetHeader className="text-left p-6">
                                <SheetTitle>Components</SheetTitle>
                                <SheetDescription>
                                    You can drag and drop componets on the convas
                                </SheetDescription>
                                
                                
                            </SheetHeader>
                            <ComponentsTab/>
                        </TabsContent>
                    </div>
                </SheetContent>
            </Tabs>
       </Sheet>
    )
}

export default FunnelEditorSidebar
