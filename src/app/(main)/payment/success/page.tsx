import Link from "next/link"
import { CheckCircleIcon, ArrowRightIcon, TicketIcon } from "lucide-react"
import { fulfillOrder } from "@/features/payment/stripe/lib/fulfillment"

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams

  if (session_id) {
    try {
      await fulfillOrder(session_id)
    } catch (error) {
      console.error("[PaymentSuccessPage] Error fulfilling order:", error)
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center py-10 w-[90%] max-w-[600px] mx-auto animate-in fade-in zoom-in duration-500">
      <div className="glass-panel p-10 rounded-3xl text-center flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full z-0 pointer-events-none"></div>

        <div className="relative z-10 w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="size-12 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-foreground relative z-10">
          Оплата прошла успешно!
        </h1>
        
        <p className="text-muted-foreground text-lg relative z-10 max-w-sm">
          Ваш заказ подтвержден. Билеты уже отправлены вам на почту и добавлены в личный кабинет.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-6 relative z-10">
          <Link 
            href="/profile/tickets"
            className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-medium hover:bg-primary/90 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <TicketIcon className="size-5" />
            Мои билеты
          </Link>
          <Link 
            href="/"
            className="flex-1 h-14 rounded-2xl bg-secondary text-secondary-foreground text-lg font-medium hover:bg-secondary/80 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            На главную
            <ArrowRightIcon className="size-5" />
          </Link>
        </div>
      </div>
    </main>
  )
}
