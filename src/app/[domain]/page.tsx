import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";
import FunnelEditor from "../(main)/agency/[agencyId]/documents/[workspaceId]/[documentId]/editor/[documentPageId]/_components/document-editor";
import DocumentAnalytics from "@/components/global/DocumentAnalytics";
import { TimeOnPageTracker } from "@/components/global/timeOnPageTracker";
import ScrollDepthTracker from "@/components/global/ScrollDepthTracker";


const Page = async ({params} : {params: {domain: string}}) => {
    const domainData = await getDomainContent(params.domain.slice(0, -1));
    if(!domainData) return notFound();
    
    const pageData = domainData.DocumentPages.find(page => !page.pathName);

    if(!pageData) return notFound();
    await db.documentPage.update({
        where: {
            id: pageData.id
        },
        data: {
            visits: {
                increment: 1
            }
        }
    });

    return ( 

        <EditorProvider 
            workspaceId={domainData.workspaceId}
            pageDetails={pageData}
            documentId={domainData.id}
        >
             <DocumentAnalytics 
                documentId={domainData.id} 
                pageId={pageData.id}
                domain={params.domain}
            />
            <TimeOnPageTracker documentId={domainData.id} />
            <ScrollDepthTracker documentId={domainData.id} />

            <FunnelEditor documentPageId={pageData.id} liveMode={true} documentId={domainData.id}/>
        </EditorProvider>
     );
}
 
export default Page;