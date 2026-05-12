import { getAllCities } from "@/entities/city/api"
import { authOption } from "@/shared/lib/auth"
import { ReactQueryProvider } from "@/shared/providers/ReactQueryProvider"
import { Category, FooterComp, HeaderComp } from "@/widgets"
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
            <div className="mt-1 px-3 pb-10 sm:mt-2 sm:px-4 md:px-5 md:pb-12">
                <Category />
                <div className="pt-4 sm:pt-5 md:pt-6">
                    {children}
                </div>
            </div>
            <FooterComp />
        </ReactQueryProvider>
    )
}