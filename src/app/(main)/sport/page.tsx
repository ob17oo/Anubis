'use client'

import { useEventsByGenre } from "@/entities/event/lib/hooks/useEventsbyGenre"
import { EventType } from "../../../../prisma/generated/prisma/enums"
import { HomePage } from "@/view"

export default function Sport(){
    const {events, isLoading, error, isEmpty} = useEventsByGenre(EventType.sport)
    return <HomePage 
        events={events}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
    />
}