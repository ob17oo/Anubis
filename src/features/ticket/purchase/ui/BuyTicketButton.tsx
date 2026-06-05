'use client'

import { TicketIcon, MinusIcon, PlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BuyTicketButtonProps {
    eventId: string
    eventSlug: string
    price: number
    ticketAmount: number
}

export function BuyTicketButton({ eventId, eventSlug, price, ticketAmount }: BuyTicketButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)

    const handlePurchase = () => {
        if (status !== 'authenticated' || !session?.user) {
            router.push(`/login?callbackUrl=/event/${eventSlug}`)
            return
        }

        router.push(`/checkout?eventId=${eventId}&quantity=${quantity}`)
    }

    const increment = () => {
        if (quantity < Math.min(10, ticketAmount)) {
            setQuantity(q => q + 1)
        }
    }

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border">
                <span className="text-sm font-medium">Количество билетов:</span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="p-1 rounded-full bg-background border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
                    >
                        <MinusIcon className="size-4" />
                    </button>
                    <span className="w-4 text-center font-semibold">{quantity}</span>
                    <button 
                        onClick={increment}
                        disabled={quantity >= Math.min(10, ticketAmount)}
                        className="p-1 rounded-full bg-background border border-border hover:bg-secondary disabled:opacity-50 transition-colors"
                    >
                        <PlusIcon className="size-4" />
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={handlePurchase}
                disabled={ticketAmount < 1}
                className="h-12 w-full rounded-2xl bg-[#FF5100] text-white text-lg font-semibold hover:bg-[#FF5100]/90 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <TicketIcon className="size-5" />
                {ticketAmount < 1 ? (
                    'Распродано'
                ) : (
                    `К оформлению ${price * quantity} ₽`
                )}
            </button>
            {status === 'unauthenticated' && (
                <p className="text-xs opacity-60 text-center">
                    Войдите в аккаунт, чтобы перейти к оформлению.
                </p>
            )}
        </div>
    )
}
