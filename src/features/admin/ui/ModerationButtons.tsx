'use client'

import { useTransition } from "react"
import { moderateEventAction } from "../action/moderate.action"

export function ModerationButtons({ eventId, status }: { eventId: string, status: string }) {
    const [isPending, startTransition] = useTransition()

    if (status !== 'MODERATING') return null

    const handleModerate = (action: 'approve' | 'reject') => {
        startTransition(async () => {
            await moderateEventAction(eventId, action)
        })
    }

    return (
        <div className="flex gap-2 justify-end">
            <button
                onClick={() => handleModerate('approve')}
                disabled={isPending}
                className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-600 rounded hover:bg-emerald-500/30 transition-colors"
            >
                {isPending ? '...' : 'Одобрить'}
            </button>
            <button
                onClick={() => handleModerate('reject')}
                disabled={isPending}
                className="text-xs px-2 py-1 bg-red-500/20 text-red-600 rounded hover:bg-red-500/30 transition-colors"
            >
                {isPending ? '...' : 'Отклонить'}
            </button>
        </div>
    )
}
