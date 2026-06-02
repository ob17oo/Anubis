import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { CalendarPlus, TicketIcon, UsersIcon } from "lucide-react"
import Link from "next/link"

export default async function OrganizerDashboard() {
    const session = await getServerSession(authOption)
    
    // Safety check, layout should handle this but TS needs it
    if (!session?.user?.id) return null

    const events = await prisma.event.findMany({
        where: { organizerId: session.user.id }
    })

    const totalTicketsSold = await prisma.ticket.count({
        where: {
            event: { organizerId: session.user.id },
            status: 'CONFIRMED'
        }
    })

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2">
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <CalendarPlus className="size-5 text-primary" /> Всего мероприятий
                    </p>
                    <p className="text-4xl font-bold font-heading">{events.length}</p>
                </div>
                <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2">
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <TicketIcon className="size-5 text-accent" /> Продано билетов
                    </p>
                    <p className="text-4xl font-bold font-heading">{totalTicketsSold}</p>
                </div>
                <div className="glass-panel p-5 md:p-6 rounded-2xl flex flex-col gap-2">
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <UsersIcon className="size-5 text-emerald-500" /> Выручка (оценка)
                    </p>
                    <p className="text-4xl font-bold font-heading">
                        {events.reduce((acc, curr) => acc + (100 - curr.ticketAmount) * curr.price, 0)} ₽
                    </p>
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-8 text-center mt-10">
                <h3 className="text-2xl font-bold font-heading mb-4">Создать новое мероприятие</h3>
                <p className="text-muted-foreground mb-6">Заполните форму, чтобы отправить событие на модерацию. После проверки оно появится в каталоге.</p>
                <Link href="/organizer/events/create">
                    <button className="bg-primary text-white font-medium py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors">
                        + Создать событие
                    </button>
                </Link>
            </div>
        </div>
    )
}
