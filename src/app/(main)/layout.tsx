import { getAllCities } from "@/entities/city/api"
import { authOption } from "@/shared/lib/auth"
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider"
import { Category, HeaderComp } from "@/widgets"
import { getServerSession } from "next-auth"

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const [session, cities] = await Promise.all([
        getServerSession(authOption),
        getAllCities()
    ])
    return (
        <ReactQueryProvider>
            <HeaderComp city={cities} session={session}/>
            <Category />
            {children}
        </ReactQueryProvider>
    )
}