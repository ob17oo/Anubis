'use client'

import { getGenreSection } from "@/entities/event/model/genre.config"
import { useEventsByGenre } from "@/entities/event/lib/hooks/useEventsbyGenre"
import { EventsView } from "@/widgets/EventsView/ui"
import { EventType } from "../../../prisma/generated/prisma"

interface GenrePageProps {
    genre: EventType
}

export function GenrePage({ genre }: GenrePageProps) {
    const section = getGenreSection(genre)
    const { events, isLoading, error, isEmpty } = useEventsByGenre(genre)

    if (!section) {
        return null
    }

    return (
        <div className="py-6">
            <EventsView
                mode="genre"
                genre={genre}
                section={section}
                events={events}
                isLoading={isLoading}
                error={error}
                isEmpty={isEmpty}
                emptyTitle={`Пока нет событий: ${section.title.toLowerCase()}`}
                emptyHint="Попробуйте другой город или загляните позже."
            />
        </div>
    )
}
