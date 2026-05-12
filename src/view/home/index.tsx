"use client"

import * as React from "react"
import { format, isSameDay } from "date-fns"
import { ru } from "date-fns/locale"

import { TEvent } from "@/entities/event/model"
import { EventCard, EventCardSkeleton } from "@/entities/event/ui"
import { DatePickerComp } from "@/widgets/DatePickerComp/ui"
import { EventType } from "../../../prisma/generated/prisma/enums"
import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"
import { eventToSlug } from "@/entities/event/lib/eventSlug"

interface HomePageProps {
    events: TEvent[],
    error: string | null,
    isLoading: boolean,
    isEmpty: boolean
}

export function HomePage({events,error, isLoading, isEmpty}:HomePageProps){
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

    const eventsByDate = React.useMemo(() => {
        if(!selectedDate) return []
        return events.filter((e) => isSameDay(e.date instanceof Date ? e.date : new Date(e.date), selectedDate))
    },[events, selectedDate])

    const sections = React.useMemo(() => {
        const map: Array<{ genre: EventType; title: string; href: string }> = [
            { genre: EventType.concert, title: "Концерты", href: "/concert" },
            { genre: EventType.theater, title: "Театр", href: "/theater" },
            { genre: EventType.cinema, title: "Кино", href: "/cinema" },
            { genre: EventType.sport, title: "Спорт", href: "/sport" },
            { genre: EventType.standup, title: "Стендап", href: "/standup" },
            { genre: EventType.kids, title: "Детям", href: "/kids" },
        ]

        return map
            .map((s) => ({
                ...s,
                events: events
                    .filter((e) => e.genre === s.genre)
                    .slice()
                    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                    .slice(0, 4),
            }))
            .filter((s) => s.events.length > 0)
    }, [events])

    return (
        <div className="flex flex-col gap-10 py-6">
            <DatePickerComp value={selectedDate} onChange={setSelectedDate} />

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && error && (
                <div className="rounded-2xl border border-[#FF5100]/30 bg-white/60 p-6">
                    <p className="text-lg">Не получилось загрузить события</p>
                    <p className="text-sm opacity-70">{error}</p>
                </div>
            )}

            {!isLoading && !error && selectedDate && (
                <section className="flex flex-col gap-5">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-2xl font-bold leading-none">
                            {format(selectedDate, "d MMMM", { locale: ru })}
                        </h2>
                        <p className="text-sm opacity-70">
                            {eventsByDate.length === 0 ? "Нет событий" : `Событий: ${eventsByDate.length}`}
                        </p>
                    </div>

                    {eventsByDate.length === 0 ? (
                        <div className="rounded-2xl border bg-white/60 p-6">
                            <p className="text-lg">На эту дату пока нет мероприятий</p>
                            <p className="text-sm opacity-70">Попробуй выбрать другой день.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventsByDate.map((e) => (
                                <Link key={e.id} href={`/event/${eventToSlug(e)}`} className="block">
                                  <EventCard event={e} />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {!isLoading && !error && !selectedDate && (
                <div className="flex flex-col gap-10">
                    {isEmpty || sections.length === 0 ? (
                        <div className="rounded-2xl border bg-white/60 p-6">
                            <p className="text-lg">Пока нет мероприятий в этом городе</p>
                            <p className="text-sm opacity-70">Попробуй сменить город или зайти позже.</p>
                        </div>
                    ) : (
                        sections.map((s) => (
                            <section
                                key={s.genre}
                                className="rounded-3xl border border-[#FF5100]/15 bg-white/50 p-6 sm:p-8 shadow-[0_8px_28px_-24px_rgba(0,0,0,0.35)]"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <Link
                                        href={s.href}
                                        className="group inline-flex items-center gap-2"
                                    >
                                        <h2 className="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] leading-none group-hover:opacity-90 transition-opacity">
                                            Популярные {s.title.toLowerCase()}
                                        </h2>
                                        <ChevronRightIcon className="size-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                    <div className="hidden sm:flex items-center gap-2">
                                        <span className="text-xs uppercase tracking-wide opacity-50">топ по рейтингу</span>
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5100]/70" />
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {s.events.map((e) => (
                                        <Link key={e.id} href={`/event/${eventToSlug(e)}`} className="block">
                                            <EventCard event={e} />
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}