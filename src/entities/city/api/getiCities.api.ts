'use server'

import { prisma } from "@/shared/lib"

export async function getAllCities(){
    try {
        const cities = await prisma.city.findMany({
            select: {
                id: true,
                name: true
            }
        })

        return cities
    } catch(error: unknown) {
         if(process.env.NODE_ENV === 'development') {
            console.log(error)
        }

        throw new Error(`Error fethcing events: ${error}`)
    }
}