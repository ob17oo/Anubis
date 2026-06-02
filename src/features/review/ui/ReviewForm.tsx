'use client'

import { useState, useTransition } from "react"
import { StarIcon } from "lucide-react"
import { submitReviewAction } from "../action/review.action"

export function ReviewForm({ eventId }: { eventId: string }) {
    const [rating, setRating] = useState(5)
    const [text, setText] = useState("")
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        startTransition(async () => {
            const res = await submitReviewAction(eventId, rating, text)
            if (res.success) {
                setIsSuccess(true)
                setMessage("Спасибо за ваш отзыв!")
            } else {
                setMessage(res.error === 'ALREADY_REVIEWED' ? 'Вы уже оставили отзыв' : 'Ошибка отправки')
            }
        })
    }

    if (isSuccess) {
        return (
            <div className="mt-8 p-6 glass-card border border-success/20 rounded-[2rem] bg-success/5 text-center">
                <p className="text-success font-medium text-lg">{message}</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-8 p-8 glass-card border border-border/50 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-accent/50 opacity-50" />
            <h3 className="text-2xl font-heading font-semibold text-foreground">Оцените событие</h3>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all duration-300 transform hover:scale-110 ${star <= rating ? 'text-accent' : 'text-muted-foreground/30'}`}
                    >
                        <StarIcon className={`size-8 ${star <= rating ? 'fill-current drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]' : ''}`} />
                    </button>
                ))}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Расскажите, что вам понравилось..."
                className="w-full bg-background border border-border rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
                required
            />
            <button
                type="submit"
                disabled={isPending}
                className="bg-foreground text-background font-medium py-3.5 px-6 rounded-2xl hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
            >
                {isPending ? 'Отправка...' : 'Отправить отзыв'}
            </button>
            {message && <p className="text-destructive text-sm font-medium text-center mt-2">{message}</p>}
        </form>
    )
}
