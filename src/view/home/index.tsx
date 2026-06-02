"use client"

import * as React from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import { TEvent } from "@/entities/event/model"
import { filterEventsByDate } from "@/entities/event/lib/filterByDate"
import { EventCardSkeleton } from "@/entities/event/ui"
import { DatePickerComp } from "@/widgets/DatePickerComp/ui"
import { SearchComp } from "@/widgets/SearchComp/ui"
import { EventsGrid, EventsView } from "@/widgets/EventsView/ui"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import { eventToSlug } from "@/entities/event/lib/eventSlug"

interface HomePageProps {
    events: TEvent[]
    error: string | null
    isLoading: boolean
    isEmpty: boolean
}

function matchesSearch(event: TEvent, query: string) {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.location.toLowerCase().includes(q)
    )
}

export function HomePage({ events, error, isLoading, isEmpty }: HomePageProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedGenre, setSelectedGenre] = React.useState<string>("all")

    const filteredEvents = React.useMemo(
        () => events.filter((e) => {
            const matchesQuery = matchesSearch(e, searchQuery)
            const matchesGenre = selectedGenre === "all" || e.genre === selectedGenre
            return matchesQuery && matchesGenre
        }),
        [events, searchQuery, selectedGenre]
    )

    const eventsByDate = React.useMemo(
        () => filterEventsByDate(filteredEvents, selectedDate),
        [filteredEvents, selectedDate]
    )

    const topEvents = React.useMemo(() => {
        return [...events].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5)
    }, [events])

    const isSearchActive = searchQuery.trim().length > 0
    const showGenreCarousels = !isLoading && !error && !selectedDate && !isSearchActive

    return (
        <div className="flex flex-col gap-10 pb-12 w-[90%] max-w-[1400px] mx-auto">
            {/* HERO SECTION */}
            {topEvents.length > 0 && !isSearchActive && !selectedDate ? (
                <section className="relative w-full h-[60vh] min-h-[500px] rounded-[2.5rem] overflow-hidden mt-6 shadow-2xl">
                    <Carousel opts={{ align: "start", loop: true }} className="w-full h-full [&_[data-slot=carousel-content]]:h-full">
                        <CarouselContent className="h-full ml-0">
                            {topEvents.map((event) => (
                                <CarouselItem key={event.id} className="pl-0 basis-full h-full relative">
                                    <Image 
                                        src={event.imageUrl} 
                                        alt={event.title} 
                                        fill 
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-20">
                                        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
                                                {event.genre}
                                            </span>
                                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight font-sans tracking-[-0.03em]">
                                                {event.title}
                                            </h1>
                                            <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 max-w-2xl leading-relaxed line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <Link 
                                                    href={`/event/${eventToSlug(event)}`}
                                                    className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
                                                >
                                                    Купить билет
                                                </Link>
                                                <span className="text-white/90 font-medium text-lg bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                                    от {event.price} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {topEvents.length > 1 && (
                            <>
                                <CarouselPrevious className="left-8 border-none bg-white/10 text-white hover:bg-white/30 hover:text-white backdrop-blur-md h-12 w-12" />
                                <CarouselNext className="right-8 border-none bg-white/10 text-white hover:bg-white/30 hover:text-white backdrop-blur-md h-12 w-12" />
                            </>
                        )}
                    </Carousel>
                </section>
            ) : null}

            <div className="flex flex-col gap-6 -mt-16 z-30 px-6 mx-auto w-full max-w-4xl">
                <div className="glass-panel p-4 md:p-6 rounded-3xl flex flex-col gap-6 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <SearchComp value={searchQuery} onChange={setSearchQuery} />
                        </div>
                        <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="all">Все жанры</option>
                            <option value="concert">Концерты</option>
                            <option value="standup">Стендап</option>
                            <option value="theater">Театр</option>
                            <option value="cinema">Кино</option>
                            <option value="kids">Детям</option>
                            <option value="sport">Спорт</option>
                        </select>
                    </div>
                    <DatePickerComp
                        value={selectedDate}
                        onChange={setSelectedDate}
                        events={filteredEvents}
                    />
                </div>
            </div>

            {isSearchActive && !isLoading && !error && (
                <p className="text-sm opacity-70">
                    {filteredEvents.length === 0
                        ? `По запросу «${searchQuery}» ничего не найдено`
                        : `Найдено: ${filteredEvents.length}`}
                </p>
            )}

            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
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
                            {eventsByDate.length === 0
                                ? "Нет событий"
                                : `Событий: ${eventsByDate.length}`}
                        </p>
                    </div>

                    {eventsByDate.length === 0 ? (
                        <div className="glass-panel rounded-2xl p-8 text-center mt-4">
                            <p className="text-xl font-heading mb-2">На эту дату пока нет мероприятий</p>
                            <p className="text-sm text-muted-foreground">Попробуй выбрать другой день.</p>
                        </div>
                    ) : (
                        <EventsView
                            mode="date-sections"
                            events={eventsByDate}
                            isLoading={false}
                            error={null}
                            isEmpty={false}
                            emptyTitle="На эту дату нет мероприятий"
                            emptyHint="Выберите другой день в карусели дат."
                        />
                    )}
                </section>
            )}

            {!isLoading && !error && isSearchActive && !selectedDate && filteredEvents.length > 0 && (
                <section className="flex flex-col gap-5">
                    <h2 className="text-2xl font-bold leading-none">Результаты поиска</h2>
                    <EventsGrid events={filteredEvents} />
                </section>
            )}

            {showGenreCarousels && (
                <EventsView
                    mode="home-sections"
                    events={filteredEvents}
                    isLoading={false}
                    error={null}
                    isEmpty={isEmpty}
                    homePreviewLimit={12}
                />
            )}
        </div>
    )
}
