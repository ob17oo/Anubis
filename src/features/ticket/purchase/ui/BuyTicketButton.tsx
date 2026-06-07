'use client'

import { TicketIcon, MinusIcon, PlusIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { cn } from "@/lib/utils"

export type TicketTypeInfo = {
    id: string;
    name: string;
    price: number;
    capacity: number;
    soldCount: number;
}

interface BuyTicketButtonProps {
    eventId: string
    eventSlug: string
    ticketTypes: TicketTypeInfo[]
}

export function BuyTicketButton({ eventId, eventSlug, ticketTypes }: BuyTicketButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const [selectedTypeId, setSelectedTypeId] = useState<string>(
        ticketTypes.find(t => (t.capacity - t.soldCount) > 0)?.id || ticketTypes[0]?.id
    )
    const [quantity, setQuantity] = useState(1)

    const selectedType = ticketTypes.find(t => t.id === selectedTypeId) || ticketTypes[0]
    const availableAmount = selectedType ? selectedType.capacity - selectedType.soldCount : 0

    const handlePurchase = () => {
        if (status !== 'authenticated' || !session?.user) {
            router.push(`/login?callbackUrl=/event/${eventSlug}`)
            return
        }

        router.push(`/checkout?eventId=${eventId}&ticketTypeId=${selectedTypeId}&quantity=${quantity}`)
    }

    const increment = () => {
        if (quantity < Math.min(10, availableAmount)) {
            setQuantity(q => q + 1)
        }
    }

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1)
        }
    }

    if (!ticketTypes || ticketTypes.length === 0) {
        return <div className="text-center text-muted-foreground p-4">Билеты не найдены</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Стоимость</p>
                <p className="text-4xl font-heading font-bold text-foreground">{selectedType.price} ₽</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Осталось</p>
                <p className={cn("text-xl font-medium", availableAmount > 0 ? "text-accent" : "text-destructive")}>
                    {availableAmount} шт.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Выберите категорию билета:</p>
                <div className="flex flex-col gap-2">
                    {ticketTypes.map(type => {
                        const available = type.capacity - type.soldCount
                        const isSoldOut = available <= 0
                        const isSelected = selectedTypeId === type.id

                        return (
                            <button
                                key={type.id}
                                onClick={() => {
                                    if (!isSoldOut) {
                                        setSelectedTypeId(type.id)
                                        setQuantity(1)
                                    }
                                }}
                                disabled={isSoldOut}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-2xl border text-left transition-all",
                                    isSelected 
                                        ? "border-primary bg-primary/10" 
                                        : "border-border bg-secondary/30 hover:border-primary/50",
                                    isSoldOut && "opacity-50 cursor-not-allowed hover:border-border grayscale"
                                )}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{type.name}</span>
                                    <span className="text-xs text-muted-foreground">{type.price} ₽</span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    {isSoldOut ? (
                                        <span className="text-xs font-medium text-destructive uppercase tracking-wider">Sold Out</span>
                                    ) : (
                                        <>
                                            <span className="text-xs text-muted-foreground">Доступно: {available}</span>
                                            {isSelected && <span className="text-xs text-primary font-medium mt-1">Выбрано</span>}
                                        </>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border">
                    <span className="text-sm font-medium">Количество билетов:</span>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={decrement}
                            disabled={quantity <= 1}
                            className="size-10 flex items-center justify-center rounded-full bg-background border border-border hover:bg-secondary disabled:opacity-50 transition-colors shrink-0"
                            aria-label="Уменьшить количество"
                        >
                            <MinusIcon className="size-4" />
                        </button>
                        <span className="w-4 text-center font-semibold text-lg">{quantity}</span>
                        <button 
                            onClick={increment}
                            disabled={quantity >= Math.min(10, availableAmount)}
                            className="size-10 flex items-center justify-center rounded-full bg-background border border-border hover:bg-secondary disabled:opacity-50 transition-colors shrink-0"
                            aria-label="Увеличить количество"
                        >
                            <PlusIcon className="size-4" />
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={availableAmount < 1}
                    className="h-12 w-full rounded-2xl bg-[#FF5100] text-white text-lg font-semibold hover:bg-[#FF5100]/90 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <TicketIcon className="size-5" />
                    {availableAmount < 1 ? (
                        'Распродано'
                    ) : (
                        `К оформлению ${selectedType.price * quantity} ₽`
                    )}
                </button>
                {status === 'unauthenticated' && (
                    <p className="text-xs opacity-60 text-center">
                        Войдите в аккаунт, чтобы перейти к оформлению.
                    </p>
                )}
            </div>
        </div>
    )
}
