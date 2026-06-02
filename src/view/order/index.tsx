import { getUserTickets } from "@/entities/ticket/api/ticket.api"
import { eventToSlug } from "@/entities/event/lib/eventSlug"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EventImage } from "@/entities/event/ui/event-image"

interface OrderPageProps {
    userId: string
}

export async function OrderPage({ userId }: OrderPageProps) {
    const tickets = await getUserTickets(userId)

    if (tickets.length === 0) {
        return (
            <main className="py-8 max-w-3xl mx-auto w-full">
                <h1 className="text-3xl font-semibold tracking-[-0.02em] mb-6">Мои билеты</h1>
                <div className="rounded-[28px] border border-[#FF5100]/15 bg-white/70 p-8 text-center">
                    <TicketIcon className="size-12 mx-auto text-[#FF5100]/70 mb-4" />
                    <p className="text-lg">У вас пока нет билетов</p>
                    <p className="text-sm opacity-70 mt-2">
                        Выберите событие на главной и нажмите «Купить билет» — оплата моковая, без списания средств.
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-6 text-[#FF5100] font-medium hover:underline"
                    >
                        Перейти к событиям
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="py-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-3xl font-semibold tracking-[-0.02em]">Мои билеты</h1>
                <Link
                    href="/return-order"
                    className="text-sm font-medium text-[#FF5100] hover:underline"
                >
                    Вернуть билет →
                </Link>
            </div>
            <div className="flex flex-col gap-5">
                {tickets.map((ticket) => {
                    const event = ticket.event
                    const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
                    const slug = eventToSlug({ id: event.id, title: event.title })

                    return (
                        <article
                            key={ticket.id}
                            className="rounded-[28px] border border-[#FF5100]/15 bg-white/70 p-5 sm:p-6 flex flex-col sm:flex-row gap-5 shadow-[0_8px_28px_-24px_rgba(0,0,0,0.35)]"
                        >
                            <div className="relative w-full sm:w-40 h-28 sm:h-32 rounded-2xl overflow-hidden border border-[#FF5100]/20 shrink-0">
                                <EventImage
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <Link
                                    href={`/event/${slug}`}
                                    className="text-xl font-semibold hover:text-[#FF5100] transition-colors"
                                >
                                    {event.title}
                                </Link>
                                <div className="flex flex-wrap gap-3 text-sm opacity-80">
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarIcon className="size-4 text-[#FF5100]" />
                                        {format(eventDate, "d MMMM yyyy", { locale: ru })}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPinIcon className="size-4 text-[#FF5100]" />
                                        {event.location}
                                    </span>
                                </div>
                                <p className="text-sm opacity-60">
                                    Оформлен {format(ticket.createdAt, "d MMM yyyy, HH:mm", { locale: ru })}
                                </p>
                                <p className="text-lg font-semibold text-[#FF5100]">
                                    {ticket.totalPrice} ₽ · {ticket.quantity} шт.
                                </p>
                            </div>
                        </article>
                    )
                })}
            </div>
        </main>
    )
}
