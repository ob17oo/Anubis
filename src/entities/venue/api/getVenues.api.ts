'use server'

import { prisma } from "@/shared/lib"

export async function getVenuesByCity(cityId: string) {
    try {
        if (!cityId) return []
        const venues = await prisma.venue.findMany({
            where: { cityId },
            select: {
                id: true,
                name: true,
                address: true,
            }
        })
        return venues
    } catch(error: unknown) {
        if(process.env.NODE_ENV === 'development') {
            console.log(error)
        }
        throw new Error(`Error fetching venues: ${error}`)
    }
}
