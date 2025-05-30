import FunnelEditor from "@/app/(main)/agency/[agencyId]/documents/[workspaceId]/[documentId]/editor/[documentPageId]/_components/document-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";

const Page = async ({params}: {params: {domain: string; path: string}}) => {

    const domainData = await getDomainContent(params.domain.slice(0, -1));
    const pageData = domainData?.DocumentPages.find(page => page.pathName === params.path);

    if(!pageData || !domainData) return notFound();
    return ( 
        <EditorProvider
            workspaceId={domainData.workspaceId}
            pageDetails={pageData}
            documentId={domainData.id}>
                <FunnelEditor documentPageId={pageData.id} liveMode={true}/>
        </EditorProvider>
    );
}
 
export default Page;