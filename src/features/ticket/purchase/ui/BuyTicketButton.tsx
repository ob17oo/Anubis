'use client'

import { TicketIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { purchaseTicketAction, checkPromoCodeAction } from "../action/purchase.action"

interface BuyTicketButtonProps {
    eventId: string
    eventSlug: string
    price: number
    ticketAmount: number
}

export function BuyTicketButton({ eventId, eventSlug, price, ticketAmount }: BuyTicketButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [message, setMessage] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
    const [promoError, setPromoError] = useState<string | null>(null)
    const [isPromoPending, setIsPromoPending] = useState(false)
    const [isPending, startTransition] = useTransition()

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return
        setIsPromoPending(true)
        setPromoError(null)
        try {
            const res = await checkPromoCodeAction(promoCode.trim(), eventId)
            if (res.success) {
                setAppliedPromo({ code: promoCode.trim(), discount: res.discount })
                setPromoError(null)
            } else {
                setPromoError(res.error)
                setAppliedPromo(null)
            }
        } catch {
            setPromoError("Ошибка проверки промокода")
            setAppliedPromo(null)
        } finally {
            setIsPromoPending(false)
        }
    }

    const handleClearPromo = () => {
        setPromoCode("")
        setAppliedPromo(null)
        setPromoError(null)
    }

    const handlePurchase = () => {
        if (status !== 'authenticated' || !session?.user) {
            router.push(`/login?callbackUrl=/event/${eventSlug}`)
            return
        }

        if (ticketAmount < 1) {
            setMessage('Билеты закончились')
            setIsSuccess(false)
            return
        }

        setMessage(null)
        startTransition(async () => {
            const result = await purchaseTicketAction(eventId, appliedPromo?.code || undefined)

            if (result.success) {
                setIsSuccess(true)
                setMessage('Билет оформлен! Смотри в «Мои билеты».')
                setAppliedPromo(null)
                setPromoCode("")
                router.refresh()
            } else {
                setIsSuccess(false)
                if (result.error === 'AUTH_REQUIRED') {
                    router.push('/login')
                    return
                }
                setMessage(result.error)
            }
        })
    }

    const finalPrice = appliedPromo ? Math.max(0, price - appliedPromo.discount) : price

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Промокод (необязательно)"
                    value={promoCode}
                    onChange={(e) => {
                        setPromoCode(e.target.value)
                        if (promoError) setPromoError(null)
                    }}
                    className="h-10 flex-1 rounded-xl bg-secondary/50 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isPending || isPromoPending || ticketAmount < 1 || !!appliedPromo}
                />
                {appliedPromo ? (
                    <button
                        type="button"
                        onClick={handleClearPromo}
                        className="h-10 px-4 rounded-xl border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 text-sm font-medium transition-colors cursor-pointer"
                    >
                        Сбросить
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={isPending || isPromoPending || ticketAmount < 1 || !promoCode.trim()}
                        className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isPromoPending ? "..." : "Применить"}
                    </button>
                )}
            </div>

            {appliedPromo && (
                <p className="text-xs text-emerald-600 font-semibold px-1">
                    ✓ Промокод применен: -{appliedPromo.discount} ₽
                </p>
            )}
            {promoError && (
                <p className="text-xs text-[#FF5100] font-semibold px-1">
                    ✕ {promoError}
                </p>
            )}

            <button
                type="button"
                onClick={handlePurchase}
                disabled={isPending || ticketAmount < 1}
                className="h-12 w-full rounded-2xl bg-[#FF5100] text-white text-lg font-semibold hover:bg-[#FF5100]/90 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <TicketIcon className="size-5" />
                {isPending ? (
                    'Оформляем…'
                ) : ticketAmount < 1 ? (
                    'Распродано'
                ) : appliedPromo ? (
                    <span className="flex items-center gap-2 font-semibold">
                        Купить за <span className="line-through text-white/70 text-sm">{price} ₽</span>
                        <span className="text-white font-bold">{finalPrice} ₽</span>
                    </span>
                ) : (
                    `Купить за ${price} ₽`
                )}
            </button>
            {message && (
                <p className={`text-sm ${isSuccess ? 'text-emerald-700' : 'text-[#FF5100]'}`}>
                    {message}
                </p>
            )}
            {status === 'unauthenticated' && (
                <p className="text-xs opacity-60">
                    Войдите в аккаунт, чтобы купить билет (мок-оплата без реальных платежей).
                </p>
            )}
        </div>
    )
}
