'use client'

import { RefundForm } from "@/features/ticket/return/ui/RefundForm"
import { eventToSlug } from "@/entities/event/lib/eventSlug"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import {
    CalendarIcon,
    MapPinIcon,
    RotateCcwIcon,
    TicketIcon,
    AlertCircleIcon,
    CheckCircle2Icon,
} from "lucide-react"
import Link from "next/link"
import { EventImage } from "@/entities/event/ui/event-image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type ReturnOrderTicket = {
    id: string
    totalPrice: number
    quantity: number
    createdAt: string
    event: {
        id: string
        title: string
        imageUrl: string
        location: string
        date: string
    }
}

interface ReturnOrderPageProps {
    tickets: ReturnOrderTicket[]
}

export function ReturnOrderPage({ tickets: initialTickets }: ReturnOrderPageProps) {
    const router = useRouter()
    const [tickets, setTickets] = useState(initialTickets)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

    const selected = tickets.find((t) => t.id === selectedId)

    if (tickets.length === 0) {
        return (
            <main className="py-8 w-full max-w-3xl mx-auto">
                <PageHeader />
                <div className="rounded-[28px] border border-[#FF5100]/15 bg-white/70 p-8 text-center">
                    <TicketIcon className="size-12 mx-auto text-[#FF5100]/70 mb-4" />
                    <p className="text-lg">Нет билетов для возврата</p>
                    <p className="text-sm opacity-70 mt-2 max-w-md mx-auto">
                        Активные билеты появятся здесь после покупки. Уже возвращённые заказы не отображаются.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mt-6">
                        <Link
                            href="/order"
                            className="text-[#FF5100] font-medium hover:underline text-sm"
                        >
                            Мои билеты
                        </Link>
                        <Link href="/" className="text-[#FF5100] font-medium hover:underline text-sm">
                            На главную
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="py-8 w-full max-w-4xl mx-auto">
            <PageHeader />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,340px)] gap-6">
                <section className="flex flex-col gap-4">
                    <p className="text-sm opacity-70 px-1">
                        Выберите билет для возврата (до начала мероприятия)
                    </p>
                    {tickets.map((ticket) => {
                        const eventDate = new Date(ticket.event.date)
                        const isSelected = selectedId === ticket.id
                        const slug = eventToSlug({
                            id: ticket.event.id,
                            title: ticket.event.title,
                        })

                        return (
                            <button
                                key={ticket.id}
                                type="button"
                                onClick={() => {
                                    setSelectedId(isSelected ? null : ticket.id)
                                    setMessage(null)
                                }}
                                className={`w-full text-left rounded-[28px] border p-5 sm:p-6 flex flex-col sm:flex-row gap-5 transition-all ${
                                    isSelected
                                        ? 'border-[#FF5100] bg-[#FF5100]/5 shadow-[0_8px_28px_-24px_rgba(255,81,0,0.45)]'
                                        : 'border-[#FF5100]/15 bg-white/70 hover:border-[#FF5100]/35'
                                }`}
                            >
                                <div className="relative w-full sm:w-36 h-28 rounded-2xl overflow-hidden border border-[#FF5100]/20 shrink-0">
                                    <EventImage
                                        src={ticket.event.imageUrl}
                                        alt={ticket.event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold truncate">{ticket.event.title}</p>
                                    <div className="mt-2 flex flex-wrap gap-3 text-sm opacity-80">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarIcon className="size-4 text-[#FF5100]" />
                                            {format(eventDate, "d MMMM yyyy", { locale: ru })}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPinIcon className="size-4 text-[#FF5100]" />
                                            {ticket.event.location}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-[#FF5100] font-semibold">
                                        {ticket.totalPrice} ₽
                                    </p>
                                    <Link
                                        href={`/event/${slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-2 inline-block text-sm opacity-60 hover:text-[#FF5100]"
                                    >
                                        Страница события →
                                    </Link>
                                </div>
                            </button>
                        )
                    })}
                </section>

                <aside className="lg:sticky lg:top-8 h-fit">
                    <div className="rounded-[28px] border border-[#FF5100]/18 bg-white/75 p-6 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.45)]">
                        {selected ? (
                            <RefundForm
                                ticketId={selected.id}
                                ticketPrice={selected.totalPrice}
                                onSubmitSuccess={() => {
                                    setTickets((prev) => prev.filter((t) => t.id !== selectedId))
                                    setSelectedId(null)
                                    setMessage({
                                        type: 'ok',
                                        text: `Запрос на возврат отправлен. После одобрения модератором ${selected.totalPrice} ₽ вернутся на ваш баланс.`,
                                    })
                                    router.refresh()
                                }}
                            />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-[#FF5100] border-b border-border pb-3 mb-4">
                                    <RotateCcwIcon className="size-5" />
                                    <h2 className="text-lg font-semibold font-heading">Оформление возврата</h2>
                                </div>
                                <p className="text-sm opacity-70">
                                    Выберите билет слева, чтобы продолжить.
                                </p>
                            </>
                        )}

                        {message && (
                            <p
                                className={`mt-4 flex items-start gap-2 text-sm rounded-xl px-3 py-2 ${
                                    message.type === 'ok'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-[#FF5100]/5 text-[#FF5100] border border-[#FF5100]/20'
                                }`}
                            >
                                {message.type === 'ok' ? (
                                    <CheckCircle2Icon className="size-4 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
                                )}
                                {message.text}
                            </p>
                        )}

                        <ul className="mt-5 text-xs opacity-60 flex flex-col gap-1.5 leading-relaxed border-t border-border pt-4">
                            <li>• Возврат доступен до начала события</li>
                            <li>• Место снова появится в продаже</li>
                            <li>• Вопросы — в разделе FAQ</li>
                        </ul>
                        <Link
                            href="/faq"
                            className="mt-3 inline-block text-sm text-[#FF5100] hover:underline"
                        >
                            Частые вопросы
                        </Link>
                    </div>
                </aside>
            </div>
        </main>
    )
}

function PageHeader() {
    return (
        <div className="flex items-start gap-4 mb-8">
            <div className="size-12 rounded-2xl border border-[#FF5100]/25 bg-[#FF5100]/10 flex items-center justify-center shrink-0">
                <RotateCcwIcon className="size-6 text-[#FF5100]" />
            </div>
            <div>
                <h1 className="text-3xl font-semibold tracking-[-0.02em]">Вернуть билет</h1>
                <p className="mt-2 text-sm opacity-70 leading-relaxed">
                    Выберите заказ и подтвердите возврат. В демо-режиме операция выполняется сразу.
                </p>
            </div>
        </div>
    )
}
