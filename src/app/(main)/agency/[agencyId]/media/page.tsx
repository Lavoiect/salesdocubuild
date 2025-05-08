import MediaComponent from "@/components/media"
import { getMedia } from "@/lib/queries"
import React from "react"

type Props = {
    params: {agencyId: string}
}

const MediaPage = async ({params}:Props) => {
  const data = await getMedia(params.agencyId)
    return (
       <div className="container">
           <MediaComponent data = {data} agencyId = {params.agencyId}/>
       </div>
     
    )
}

export default MediaPage
