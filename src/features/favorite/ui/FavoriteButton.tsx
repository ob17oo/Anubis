'use client'

import { HeartIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toggleFavoriteAction } from "../action/favorite.action"

interface FavoriteButtonProps {
    eventId: string
    initialIsFavorite: boolean
    pathToRevalidate?: string
}

export function FavoriteButton({ eventId, initialIsFavorite, pathToRevalidate }: FavoriteButtonProps) {
    const { status } = useSession()
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        if (status !== 'authenticated') {
            router.push('/login')
            return
        }

        // Optimistic UI update
        setIsFavorite(!isFavorite)

        startTransition(async () => {
            const result = await toggleFavoriteAction(eventId, pathToRevalidate)
            if (!result.success) {
                // Revert on error
                setIsFavorite(isFavorite)
                if (result.error === 'AUTH_REQUIRED') {
                    router.push('/login')
                }
            } else {
                if (result.isFavorite !== undefined) {
                    setIsFavorite(result.isFavorite)
                }
            }
        })
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                isFavorite
                    ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'
                    : 'bg-background/80 border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
        >
            <HeartIcon className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
    )
}
