import { prisma } from "@/shared/lib"
import { slugToEventId } from "../lib/eventSlug"
import { EventType, EventStatus } from "../../../../prisma/generated/prisma"

export type GetEventsOptions = {
    genre?: EventType
    sortBy?: 'date' | 'price' | 'rating'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
}

export async function getAllEventsByCity(cityId?: string, options?: GetEventsOptions) {
    try {
        if(!cityId){
            throw new Error(`CITY_ID_REQUIRED`)
        }

        const { genre, sortBy = 'date', sortOrder = 'asc', page = 1, limit = 20 } = options || {}
        const skip = (page - 1) * limit

        const events = await prisma.event.findMany({
            where: {
                cityId: cityId,
                status: EventStatus.PUBLISHED,
                ...(genre ? { genre } : {})
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limit
        })
        return events

    } catch(error: unknown) {
        if(error instanceof Error && error.message === 'CITY_ID_REQUIRED'){
            throw new Error(`CITY_UNSET`)
        }
        throw new Error(`Error fetching events: ${error}`)
    }
}


export async function getEventsByGenre(cityId: string, genre: EventType, options?: Omit<GetEventsOptions, 'genre'>){
    return getAllEventsByCity(cityId, { ...options, genre })
}

export async function getEventById(eventId: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if (!event) {
            throw new Error('EVENT_NOT_FOUND')
        }

        return event
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'EVENT_NOT_FOUND') {
            throw new Error('EVENT_NOT_FOUND')
        }
        throw new Error(`Error fetching event: ${error}`)
    }
}

export async function getEventBySlug(slug: string) {
    const eventId = slugToEventId(slug)
    return getEventById(eventId)
}