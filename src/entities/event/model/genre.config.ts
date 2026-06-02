import { EventType } from "../../../../prisma/generated/prisma"

export type GenreSectionConfig = {
    genre: EventType
    title: string
    href: string
}

export const GENRE_SECTIONS: GenreSectionConfig[] = [
    { genre: EventType.concert, title: "Концерты", href: "/events/concert" },
    { genre: EventType.theater, title: "Театр", href: "/events/theater" },
    { genre: EventType.cinema, title: "Кино", href: "/events/cinema" },
    { genre: EventType.sport, title: "Спорт", href: "/events/sport" },
    { genre: EventType.standup, title: "Стендап", href: "/events/standup" },
    { genre: EventType.kids, title: "Детям", href: "/events/kids" },
]

export function getGenreSection(genre: EventType) {
    return GENRE_SECTIONS.find((s) => s.genre === genre)
}
