'use server'

import { prisma } from "@/shared/lib"
import { EventType } from "../../../../prisma/generated/prisma/enums"

export async function getAllEventsByCity(cityId?: string) {
    try {
        if(!cityId){
            throw new Error(`CITY_ID_REQUIRED`)
        }

        const events = await prisma.event.findMany({
            where: {
                cityId: cityId
            },
            orderBy: {
                date: 'asc'
            }
        })
        return events

    } catch(error: unknown) {
        if(process.env.NODE_ENV === 'development') {
            console.log(error)
        }

        if(error instanceof Error && error.message === 'CITY_ID_REQUIRED'){
            throw new Error(`CITY_UNSET`)
        }

        throw new Error(`Error fethcing events: ${error}`)
    }
}


export async function getEventsByGenre(cityId: string, genre: EventType){
    try {
         if(!cityId){
            throw new Error('CITY_ID_REQUIRED')
        }

        const events = await prisma.event.findMany({
            where: {
                cityId: cityId,
                genre: genre
            }
        })

        return events
    } catch(error:unknown){
        if(process.env.NODE_ENV === 'development') {
            console.log(error)
        }

        if(error instanceof Error && error.message === 'CITY_ID_REQUIRED'){
            throw new Error(`CITY_UNSET`)
        }

        throw new Error(`Error fethcing events: ${error}`)
    }
}