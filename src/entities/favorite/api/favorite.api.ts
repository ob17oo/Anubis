import { prisma } from "@/shared/lib"

export async function toggleFavoriteMock(userId: string, eventId: string) {
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        },
    })

    if (existing) {
        await prisma.favorite.delete({
            where: { id: existing.id },
        })
        return { isFavorite: false }
    } else {
        await prisma.favorite.create({
            data: { userId, eventId },
        })
        return { isFavorite: true }
    }
}

export async function getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
        where: { userId },
        include: { event: true },
        orderBy: { createdAt: 'desc' },
    })
}
