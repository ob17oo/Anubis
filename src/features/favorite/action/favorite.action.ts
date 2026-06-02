'use server'

import { toggleFavoriteMock } from "@/entities/favorite/api/favorite.api"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function toggleFavoriteAction(eventId: string, pathToRevalidate?: string) {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        return { success: false, error: 'AUTH_REQUIRED' }
    }

    try {
        const result = await toggleFavoriteMock(session.user.id, eventId)
        if (pathToRevalidate) {
            revalidatePath(pathToRevalidate)
        }
        return { success: true, isFavorite: result.isFavorite }
    } catch (error) {
        return { success: false, error: 'FAILED_TO_TOGGLE_FAVORITE' }
    }
}
