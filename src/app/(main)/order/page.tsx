import { OrderPage } from "@/view/order"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Order() {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/order')
    }

    return <OrderPage userId={session.user.id} />
}
