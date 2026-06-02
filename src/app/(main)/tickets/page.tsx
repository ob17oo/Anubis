import { getUserTickets } from "@/entities/ticket/api/ticket.api"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { QrCodeIcon } from "lucide-react"
import { TicketList } from "@/features/ticket/list/ui/TicketList"

export const metadata = {
    title: "Мои билеты | Anubis",
}

export default async function TicketsPage() {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/tickets')
    }

    const tickets = await getUserTickets(session.user.id)

    return (
        <main className="py-12 w-full max-w-7xl mx-auto px-6 animate-in fade-in duration-500">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-10 tracking-tight">Мои билеты</h1>

            {tickets.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-3xl flex flex-col items-center justify-center gap-4">
                    <QrCodeIcon className="size-16 text-muted-foreground opacity-50" />
                    <p className="text-xl font-medium">У вас пока нет билетов</p>
                    <p className="text-muted-foreground">Самое время найти что-то интересное в каталоге!</p>
                </div>
            ) : (
                <TicketList tickets={tickets} />
            )}
        </main>
    )
}
