'use client'

import { useState, useTransition } from "react"
import { createRefundRequestAction } from "../action/returnTicket.action"
import { RotateCcwIcon, AlertCircleIcon } from "lucide-react"

const REFUND_REASONS = [
    "Заболел(а) и не могу прийти",
    "Изменились личные планы",
    "Мероприятие перенесено или отменено",
    "Ошибочная покупка",
    "Другая причина"
]

interface RefundFormProps {
    ticketId: string
    ticketPrice: number
    onSubmitSuccess: () => void
    onCancel?: () => void
}

export function RefundForm({ ticketId, ticketPrice, onSubmitSuccess, onCancel }: RefundFormProps) {
    const [reasonOption, setReasonOption] = useState(REFUND_REASONS[0])
    const [customReason, setCustomReason] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const finalReason = reasonOption === "Другая причина" 
            ? customReason.trim() 
            : reasonOption

        if (reasonOption === "Другая причина" && !customReason.trim()) {
            setError("Пожалуйста, опишите причину возврата")
            return
        }

        startTransition(async () => {
            const res = await createRefundRequestAction(ticketId, finalReason)
            if (res.success) {
                onSubmitSuccess()
            } else {
                setError(res.error)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-3">
                <RotateCcwIcon className="size-5 animate-pulse" />
                <h3 className="text-lg font-semibold font-heading">Запрос на возврат билета</h3>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Сумма к возврату (мок)
                </label>
                <p className="text-2xl font-bold text-primary font-mono">{ticketPrice} ₽</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    После одобрения модератором сумма вернется на ваш условный баланс.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="refund-reason" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Укажите причину возврата
                </label>
                <select
                    id="refund-reason"
                    value={reasonOption}
                    onChange={(e) => {
                        setReasonOption(e.target.value)
                        setError(null)
                    }}
                    className="h-11 w-full rounded-xl bg-secondary/50 border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                >
                    {REFUND_REASONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            {reasonOption === "Другая причина" && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    <label htmlFor="custom-reason" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Опишите причину подробно
                    </label>
                    <textarea
                        id="custom-reason"
                        placeholder="Почему вы хотите вернуть билет?"
                        value={customReason}
                        onChange={(e) => {
                            setCustomReason(e.target.value)
                            setError(null)
                        }}
                        rows={3}
                        className="w-full rounded-xl bg-secondary/50 border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                </div>
            )}

            {error && (
                <div className="flex items-start gap-2 bg-[#FF5100]/5 text-[#FF5100] border border-[#FF5100]/25 rounded-xl p-3 text-sm font-semibold">
                    <AlertCircleIcon className="size-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="flex gap-3 border-t border-border pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isPending}
                        className="h-11 flex-1 rounded-xl border border-border text-foreground hover:bg-secondary/40 font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Отмена
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-11 flex-1 rounded-xl bg-[#FF5100] hover:bg-[#FF5100]/95 text-white font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Отправка...' : 'Отправить запрос'}
                </button>
            </div>
        </form>
    )
}
