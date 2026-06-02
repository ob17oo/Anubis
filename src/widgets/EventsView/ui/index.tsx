'use client'

import { TEvent } from "@/entities/event/model"
import { GENRE_SECTIONS, type GenreSectionConfig } from "@/entities/event/model/genre.config"
import { EventCard, EventCardSkeleton } from "@/entities/event/ui"
import { eventToSlug } from "@/entities/event/lib/eventSlug"
import { EventCarouselSection } from "@/widgets/EventCarouselSection/ui"
import { EventType } from "../../../../prisma/generated/prisma"
import Link from "next/link"

interface EventsViewBaseProps {
    events: TEvent[]
    isLoading: boolean
    error: string | null
    isEmpty: boolean
    emptyTitle?: string
    emptyHint?: string
}

interface EventsViewHomeProps extends EventsViewBaseProps {
    mode: "home-sections"
    homePreviewLimit?: number
}

interface EventsViewDateProps extends EventsViewBaseProps {
    mode: "date-sections"
    homePreviewLimit?: number
}

interface EventsViewGenreProps extends EventsViewBaseProps {
    mode: "genre"
    genre: EventType
    section: GenreSectionConfig
}

export type EventsViewProps = EventsViewHomeProps | EventsViewDateProps | EventsViewGenreProps

function buildGenreSections(events: TEvent[], limit?: number) {
    return GENRE_SECTIONS.map((s) => ({
        ...s,
        events: sortByRating(events.filter((e) => e.genre === s.genre)),
    }))
        .filter((s) => s.events.length > 0)
        .map((s) => ({
            ...s,
            events: limit ? s.events.slice(0, limit) : s.events,
        }))
}

function sortByRating(events: TEvent[]) {
    return [...events].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
}

export function EventsView(props: EventsViewProps) {
    const {
        events,
        isLoading,
        error,
        isEmpty,
        emptyTitle = "Пока нет мероприятий в этом городе",
        emptyHint = "Попробуй сменить город или зайти позже.",
    } = props

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-destructive/30 bg-surface p-6 shadow-sm">
                <p className="text-lg">Не получилось загрузить события</p>
                <p className="text-sm opacity-70">{error}</p>
            </div>
        )
    }

    if (props.mode === "date-sections" || props.mode === "home-sections") {
        const limit = props.mode === "home-sections" ? (props.homePreviewLimit ?? 12) : undefined
        const sections = buildGenreSections(events, limit)

        if (sections.length === 0) {
            return (
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <p className="text-lg">{emptyTitle}</p>
                    <p className="text-sm opacity-70">{emptyHint}</p>
                </div>
            )
        }

        return (
            <div className="flex flex-col gap-10">
                {sections.map((s) => (
                    <EventCarouselSection
                        key={s.genre}
                        events={s.events}
                        title={
                            props.mode === "date-sections"
                                ? `${s.title} на выбранную дату`
                                : `Популярные ${s.title.toLowerCase()}`
                        }
                        href={props.mode === "home-sections" ? s.href : undefined}
                        limit={limit}
                    />
                ))}
            </div>
        )
    }

    if (props.mode === "genre") {
        const sorted = sortByRating(events)

        if (isEmpty || sorted.length === 0) {
            return (
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <p className="text-lg">{emptyTitle}</p>
                    <p className="text-sm opacity-70 mt-1">{emptyHint}</p>
                    <Link href="/" className="inline-block mt-4 text-primary font-medium hover:underline">
                        На главную
                    </Link>
                </div>
            )
        }

        return (
            <EventCarouselSection
                events={sorted}
                title={props.section.title}
                subtitle="все события категории"
            />
        )
    }

    return null
}

/** Сетка для поиска и фильтра по дате на главной */
export function EventsGrid({ events }: { events: TEvent[] }) {
    if (events.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
                <Link key={e.id} href={`/event/${eventToSlug(e)}`} className="block">
                    <EventCard event={e} />
                </Link>
            ))}
        </div>
    )
}
