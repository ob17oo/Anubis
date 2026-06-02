import { NextResponse } from 'next/server'
import { getAllEventsByCity, getEventsByGenre } from '@/entities/event/api'
import { EventType } from '../../../../prisma/generated/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cityId = searchParams.get('cityId')
    const genre = searchParams.get('genre')

    if (!cityId) {
        return NextResponse.json({ error: 'CITY_ID_REQUIRED' }, { status: 400 })
    }

    try {
        let events
        if (genre) {
            events = await getEventsByGenre(cityId, genre as EventType)
        } else {
            events = await getAllEventsByCity(cityId)
        }
        return NextResponse.json(events)
    } catch (error) {
        return NextResponse.json({ error: 'FAILED_TO_FETCH_EVENTS' }, { status: 500 })
    }
}
