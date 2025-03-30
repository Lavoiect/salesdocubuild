import BlurPage from "@/components/global/blur-page"
import { db } from "@/lib/db"

type Props = {
   params : {subaccountId: string}
}
const SubaccountPageId = async ({params}: Props) => {

    const subaccountDetails = await db.subAccount.findUnique({
        where: {
            id: params.subaccountId,
        }
    })
    return (
        <BlurPage>
            {params.subaccountId}
        </BlurPage>
    )
}

export default SubaccountPageId

