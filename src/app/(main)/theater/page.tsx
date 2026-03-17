'use client'

import { useEventsByGenre } from "@/entities/event/lib/hooks/useEventsbyGenre"
import { EventType } from "../../../../prisma/generated/prisma/enums"
import { HomePage } from "@/view"

export default function Theater(){
    const {events, isLoading, error, isEmpty} = useEventsByGenre(EventType.theater)
    return <HomePage 
        events={events}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
    />
}