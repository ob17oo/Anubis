'use client'

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"

interface ConfirmPaymentButtonProps {
  paymentId: string
  paymentStatus: string
  transactionId: string | null
}

export function ConfirmPaymentButton({ paymentId, paymentStatus, transactionId }: ConfirmPaymentButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (paymentStatus !== 'PENDING') return null
  if (!transactionId || !transactionId.startsWith('cs_')) return null

  const handleConfirm = () => {
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/payments/fulfill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentId }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || 'Ошибка при подтверждении оплаты')
        }

        router.refresh()
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Ошибка')
        alert(err.message || 'Не удалось подтвердить оплату')
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConfirm}
        disabled={isPending}
        className="text-xs font-semibold px-3 py-1.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-sm disabled:bg-muted disabled:text-muted-foreground"
      >
        {isPending ? 'Загрузка...' : 'Подтвердить оплату'}
      </button>
      {error && <span className="text-[10px] text-destructive">{error}</span>}
    </div>
  )
}
