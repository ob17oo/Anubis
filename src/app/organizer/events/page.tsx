import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { CalendarIcon, PlusCircleIcon } from "lucide-react"

export default async function OrganizerEventsPage() {
    const session = await getServerSession(authOption)
    
    if (!session?.user?.id) return null

    const events = await prisma.event.findMany({
        where: { organizerId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading font-bold">Мои мероприятия</h1>
                <Link href="/organizer/events/create">
                    <button className="flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded-xl hover:bg-primary/90 transition-colors">
                        <PlusCircleIcon className="size-5" />
                        Создать событие
                    </button>
                </Link>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-secondary/50">
                            <th className="p-4 font-medium text-muted-foreground">Название</th>
                            <th className="p-4 font-medium text-muted-foreground">Дата</th>
                            <th className="p-4 font-medium text-muted-foreground">Статус</th>
                            <th className="p-4 font-medium text-muted-foreground">Билеты (Осталось)</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                                <td className="p-4 font-medium">{event.title}</td>
                                <td className="p-4 text-muted-foreground flex items-center gap-2">
                                    <CalendarIcon className="size-4" />
                                    {new Date(event.date).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        event.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-500' : 
                                        event.status === 'MODERATING' ? 'bg-yellow-500/20 text-yellow-500' : 
                                        event.status === 'CANCELLED' ? 'bg-destructive/20 text-destructive' :
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                        {event.status === 'PUBLISHED' ? 'Опубликовано' : 
                                         event.status === 'MODERATING' ? 'На модерации' : 
                                         event.status === 'CANCELLED' ? 'Отменено' : 'Черновик'}
                                    </span>
                                </td>
                                <td className="p-4">{event.ticketAmount} шт.</td>
                                <td className="p-4 text-right">
                                    <Link href={`/event/${event.id}`}>
                                        <button className="text-sm text-primary hover:underline">
                                            Просмотр
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    У вас пока нет созданных мероприятий.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
