import { chatSession } from "@/config/AIModel"
import { upsertDocumentPage } from "@/lib/queries"
import { NextResponse } from "next/server"
import { v4 } from "uuid"




export async function POST(request: Request) {
    const {prompt, documentId} = await request.json()
    
   //console.log(prompt)
    try {
        const res = await chatSession.sendMessage(prompt)
        //console.log('res'+res)
        const aiRes = res.response.text()
        console.log(aiRes)

         upsertDocumentPage(
                { 
                    name: 'AI Generated Page',
                    id: v4(),
                    order: 0,
                    pathName: '',
                    content: aiRes,
                    
                  },
                documentId)
        return new NextResponse(aiRes)
    } catch (error) {
        return NextResponse.json({error:error})
    }
}

