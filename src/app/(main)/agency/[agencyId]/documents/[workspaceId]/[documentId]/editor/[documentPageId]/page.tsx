import { db } from "@/lib/db"
import EditorProvider from "@/providers/editor/editor-provider"
import { redirect } from "next/navigation"
import FunnelEditorSidebar from "./_components/document-editor-sidebar"
import FunnelEditor from "./_components/document-editor"
import FunnelEditorNav from "./_components/document-editor-nav"


type Props = {
    params: {
        documentId: string
        documentPageId: string
        workspaceId: string
    }
}

const Page = async ({params}:Props) => {
    const documentPageDetails = await db.documentPage.findFirst({
        where: {
            id: params.documentPageId,
        },
    })
  
    if(!documentPageDetails){
        return redirect(`/agency/${params.workspaceId}`)
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
             <EditorProvider
                    workspaceId={params.workspaceId}
                    documentId={params.documentId}
                    pageDetails={documentPageDetails}
                >
                <FunnelEditorNav
                    documentId={params.workspaceId}
                    documentPageDetails={documentPageDetails}
                    workspaceId={params.workspaceId}
                />

                <div className="h-full flex justify-center">
                    <FunnelEditor documentPageId={params.documentPageId}/>
                </div>

                <FunnelEditorSidebar subaccountId={params.workspaceId}/>
            </EditorProvider>
        </div>
    )
}

export default Page