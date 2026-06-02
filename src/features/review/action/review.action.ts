'use server'

import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { reviewRateLimiter } from "@/shared/lib/rateLimit"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const reviewSchema = z.object({
    eventId: z.string().cuid('Неверный ID события'),
    rating: z.number().min(1).max(5),
    text: z.string().max(1000).optional().transform(val => val?.trim() || "")
})

export async function submitReviewAction(eventId: string, rating: number, text: string) {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        return { success: false, error: 'AUTH_REQUIRED' }
    }

    if (!reviewRateLimiter.check(session.user.id)) {
        return { success: false, error: 'TOO_MANY_REQUESTS' }
    }

    const validated = reviewSchema.safeParse({ eventId, rating, text })
    if (!validated.success) {
        return { success: false, error: 'INVALID_DATA' }
    }

    try {
        const existing = await prisma.review.findUnique({
            where: { userId_eventId: { userId: session.user.id, eventId } }
        })

        if (existing) {
            return { success: false, error: 'ALREADY_REVIEWED' }
        }

        await prisma.$transaction(async (tx) => {
            await tx.review.create({
                data: {
                    userId: session.user.id,
                    eventId: validated.data.eventId,
                    rating: validated.data.rating,
                    text: validated.data.text,
                }
            })

            const allReviews = await tx.review.findMany({ 
                where: { eventId: validated.data.eventId },
                select: { rating: true }
            })
            const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length

            await tx.event.update({
                where: { id: validated.data.eventId },
                data: { rating: avgRating }
            })
        })

        revalidatePath(`/event`)
        return { success: true }
    } catch (error) {
        return { success: false, error: 'FAILED_TO_SUBMIT' }
    }
}
