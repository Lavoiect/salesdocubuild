import MediaComponent from "@/components/media"
import { getMedia } from "@/lib/queries"
import { GetMediaFiles } from "@/lib/types"
import { useEffect, useState } from "react"

type Props = {
    agencyId:string
}

const MediaBucketTab = (props: Props) => {
    const [data, setdata] = useState<GetMediaFiles>(null)

    useEffect(() =>{
        const fetchData = async () => {
            const response = await getMedia(props.agencyId)
            setdata(response)
        }
        fetchData()
    }, [props.agencyId])

    return (
        <div className="h-[900px] overflow-scroll p-4">
            <MediaComponent
                data={data}
                agencyId={props.agencyId}
                />

        </div>
    )
}

export default MediaBucketTab