import { prisma } from "@/shared/lib"

export async function getAllEvents() {
    try {
        const events = await prisma.event.findMany()
        return events
    } catch(error: unknown) {
        if(process.env.NODE_ENV === 'development') {
            console.log(error)
        }

        throw new Error(`Error fethcing events: ${error}`)
    }
}