'use client'

import { useState } from "react"
import { CreditCardIcon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  eventId: string
  ticketTypeId: string
  quantity: number
}

export function CheckoutButton({ eventId, ticketTypeId, quantity }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, ticketTypeId, quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Что-то пошло не так')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Не удалось получить ссылку на оплату')
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="h-14 w-full rounded-2xl bg-foreground text-background text-lg font-semibold hover:bg-foreground/90 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl"
      >
        {isLoading ? (
          <Loader2Icon className="size-5 animate-spin" />
        ) : (
          <CreditCardIcon className="size-5" />
        )}
        {isLoading ? 'Подготовка оплаты...' : 'Оплатить картой'}
      </button>
      {error && (
        <p className="text-sm text-destructive text-center mt-2">{error}</p>
      )}
    </div>
  )
}
