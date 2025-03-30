import BlurPage from "@/components/global/blur-page"
import MediaComponent from "@/components/media"
import { getMedia } from "@/lib/queries"
import React from "react"

type Props = {
    params: {agencyId: string}
}

const MediaPage = async ({params}:Props) => {
  const data = await getMedia(params.agencyId)
    return (
        <BlurPage>
            <MediaComponent data = {data} agencyId = {params.agencyId}/>
      </BlurPage>
    )
}

export default MediaPage
