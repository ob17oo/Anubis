'use client'

import { useState, useMemo } from "react"
import { getGenreSection } from "@/entities/event/model/genre.config"
import { useEventsByGenre } from "@/entities/event/lib/hooks/useEventsbyGenre"
import { filterEventsByDate } from "@/entities/event/lib/filterByDate"
import { EventsView } from "@/widgets/EventsView/ui"
import { DatePickerComp } from "@/widgets/DatePickerComp/ui"
import { EventType } from "../../../prisma/generated/prisma"

interface GenrePageProps {
    genre: EventType
}

export function GenrePage({ genre }: GenrePageProps) {
    const section = getGenreSection(genre)
    const { events, isLoading, error, isEmpty } = useEventsByGenre(genre)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const filteredEvents = useMemo(
        () => filterEventsByDate(events, selectedDate),
        [events, selectedDate]
    )

    if (!section) {
        return null
    }

    return (
        <div className="py-6 flex flex-col gap-8 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="glass-panel p-4 md:p-6 rounded-3xl shadow-2xl">
                <DatePickerComp
                    value={selectedDate}
                    onChange={setSelectedDate}
                    events={events}
                />
            </div>
            
            <EventsView
                mode="genre"
                genre={genre}
                section={section}
                events={filteredEvents}
                isLoading={isLoading}
                error={error}
                isEmpty={isEmpty && !selectedDate}
                emptyTitle={selectedDate ? "На эту дату нет событий в категории" : `Пока нет событий: ${section.title.toLowerCase()}`}
                emptyHint={selectedDate ? "Попробуйте выбрать другой день." : "Попробуйте другой город или загляните позже."}
            />
        </div>
    )
}
