import { getRefundRequests } from "@/entities/ticket/api/ticket.api"
import { approveRefundRequestAction, rejectRefundRequestAction } from "@/features/ticket/return/action/returnTicket.action"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CheckCircle2Icon, XCircleIcon, AlertCircleIcon, RotateCcw } from "lucide-react"

export const metadata = {
    title: "Модерация возвратов | Admin Anubis",
}

export default async function AdminRefundsPage() {
    const requests = await getRefundRequests()

    const pendingRequests = requests.filter(r => r.status === 'PENDING')
    const historyRequests = requests.filter(r => r.status !== 'PENDING')

    async function handleApprove(formData: FormData) {
        "use server"
        const id = formData.get("requestId") as string
        await approveRefundRequestAction(id)
    }

    async function handleReject(formData: FormData) {
        "use server"
        const id = formData.get("requestId") as string
        await rejectRefundRequestAction(id)
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <RotateCcw className="size-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold">Заявки на возврат билетов</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Просмотрите запросы пользователей на возврат средств за билеты.
                    </p>
                </div>
            </div>

            {/* Active Requests */}
            <div className="space-y-4">
                <h2 className="text-xl font-heading font-semibold">Активные запросы ({pendingRequests.length})</h2>
                <div className="glass-panel rounded-2xl overflow-x-auto border border-border">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Событие</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Пользователь</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Билет / Стоимость</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Причина возврата</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Дата запроса</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pendingRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="p-4">
                                        <p className="font-semibold text-foreground">{req.ticket.event.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(req.ticket.event.date), "d MMM yyyy, HH:mm", { locale: ru })}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-foreground">{req.ticket.user.userName}</p>
                                        <p className="text-xs text-muted-foreground">{req.ticket.user.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-mono text-sm font-semibold">{req.ticket.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-sm text-primary font-bold mt-1">
                                            {req.ticket.totalPrice} ₽ <span className="text-xs text-muted-foreground font-normal">({req.ticket.quantity} шт.)</span>
                                        </p>
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-sm bg-secondary/40 border border-border px-3 py-2 rounded-xl text-foreground font-medium leading-relaxed break-words">
                                            {req.reason}
                                        </p>
                                    </td>
                                    <td className="p-4 text-xs text-muted-foreground">
                                        {format(new Date(req.createdAt), "d MMM yyyy, HH:mm", { locale: ru })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={handleReject} className="inline">
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <button
                                                    type="submit"
                                                    className="h-9 px-3 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 text-xs font-semibold transition-colors cursor-pointer"
                                                >
                                                    Отклонить
                                                </button>
                                            </form>
                                            <form action={handleApprove} className="inline">
                                                <input type="hidden" name="requestId" value={req.id} />
                                                <button
                                                    type="submit"
                                                    className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                                                >
                                                    Одобрить
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pendingRequests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        <AlertCircleIcon className="size-8 mx-auto text-muted-foreground/60 mb-2" />
                                        Нет активных запросов на возврат билетов.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Requests */}
            <div className="space-y-4">
                <h2 className="text-xl font-heading font-semibold">История обработанных ({historyRequests.length})</h2>
                <div className="glass-panel rounded-2xl overflow-x-auto border border-border">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Событие</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Пользователь</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Сумма</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Причина</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Статус</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Дата обработки</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {historyRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-secondary/5 transition-colors opacity-80">
                                    <td className="p-4">
                                        <p className="font-semibold text-foreground">{req.ticket.event.title}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-foreground">{req.ticket.user.userName}</p>
                                    </td>
                                    <td className="p-4 font-mono font-bold text-sm">
                                        {req.ticket.totalPrice} ₽
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground truncate max-w-xs">
                                        {req.reason}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                                            req.status === 'APPROVED' 
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                                : 'bg-destructive/10 text-destructive border border-destructive/20'
                                        }`}>
                                            {req.status === 'APPROVED' ? (
                                                <>
                                                    <CheckCircle2Icon className="size-3.5" />
                                                    Одобрен
                                                </>
                                            ) : (
                                                <>
                                                    <XCircleIcon className="size-3.5" />
                                                    Отклонен
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-xs text-muted-foreground">
                                        {format(new Date(req.updatedAt), "d MMM yyyy, HH:mm", { locale: ru })}
                                    </td>
                                </tr>
                            ))}
                            {historyRequests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">История пуста.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
