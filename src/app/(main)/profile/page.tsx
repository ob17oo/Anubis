import { ProfilePage } from "@/view/profile"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Profile() {
    const session = await getServerSession(authOption)

    if (!session?.user) {
        redirect('/login?callbackUrl=/profile')
    }

    return <ProfilePage session={session} />
}
