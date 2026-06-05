import { prisma } from "@/shared/lib"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      order: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Платежи</h1>
          <p className="text-muted-foreground">История транзакций и заказов.</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-border shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID Транзакции</th>
                <th className="px-6 py-4 font-medium">Пользователь</th>
                <th className="px-6 py-4 font-medium">Сумма</th>
                <th className="px-6 py-4 font-medium">Статус платежа</th>
                <th className="px-6 py-4 font-medium">Статус заказа</th>
                <th className="px-6 py-4 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    Платежей пока нет
                  </td>
                </tr>
              )}
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs max-w-[150px] truncate" title={payment.transactionId || payment.id}>
                    {payment.transactionId || payment.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.order.user.userName}</span>
                      <span className="text-xs text-muted-foreground">{payment.order.user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {payment.amount} {payment.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      payment.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      payment.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      payment.status === 'FAILED' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      'bg-secondary text-muted-foreground border-border'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-foreground border border-border">
                      {payment.order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(payment.createdAt), "d MMM yyyy, HH:mm", { locale: ru })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
