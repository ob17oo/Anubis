import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, TicketIcon, ShieldCheckIcon } from "lucide-react"
import { prisma } from "@/shared/lib"
import { getServerSession } from "next-auth"
import { authOption } from "@/shared/lib/auth"
import { CheckoutButton } from "@/features/payment/stripe/ui/CheckoutButton"

type PageProps = {
  searchParams: Promise<{ eventId?: string; quantity?: string }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOption)
  if (!session?.user) {
    redirect('/login')
  }

  const { eventId, quantity: quantityParam } = await searchParams

  if (!eventId) {
    notFound()
  }

  const quantity = quantityParam ? parseInt(quantityParam, 10) : 1

  if (isNaN(quantity) || quantity < 1) {
    redirect('/')
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!event || event.ticketAmount < quantity) {
    notFound()
  }

  const subtotal = event.price * quantity
  // Example service fee logic - can be 0 or a fixed percentage
  const serviceFee = 0 
  const total = subtotal + serviceFee

  return (
    <main className="py-10 w-[90%] max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-heading font-bold mb-8 text-foreground">
        Оформление заказа
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-6">
          <section className="glass-panel p-6 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 border-b border-border pb-4">Информация о событии</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden shrink-0">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="size-4 text-primary" />
                  {format(new Date(event.date), "d MMMM yyyy, HH:mm", { locale: ru })}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4 text-accent" />
                  {event.location}
                </div>
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-3xl">
            <h2 className="text-xl font-semibold mb-6 border-b border-border pb-4">Данные покупателя</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium mt-1">{session.user.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Имя пользователя</label>
                <p className="font-medium mt-1">{session.user.name || session.user.userName}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Билеты будут привязаны к этому аккаунту и доступны в разделе "Мои билеты".
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="glass-panel p-6 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full z-0 pointer-events-none"></div>
             
             <h3 className="text-lg font-semibold mb-6 relative z-10">Ваш заказ</h3>

             <div className="flex flex-col gap-4 relative z-10 border-b border-border pb-6 mb-6">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-muted-foreground flex items-center gap-2">
                   <TicketIcon className="size-4" /> Билеты ({quantity} шт.)
                 </span>
                 <span className="font-medium">{subtotal} ₽</span>
               </div>
               {serviceFee > 0 && (
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground">Сервисный сбор</span>
                   <span className="font-medium">{serviceFee} ₽</span>
                 </div>
               )}
             </div>

             <div className="flex justify-between items-end mb-6 relative z-10">
               <span className="text-lg font-medium">Итого к оплате</span>
               <span className="text-3xl font-heading font-bold text-foreground">{total} ₽</span>
             </div>

             <div className="relative z-10">
               <CheckoutButton eventId={event.id} quantity={quantity} />
             </div>

             <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground relative z-10 bg-secondary/30 p-3 rounded-xl border border-border">
               <ShieldCheckIcon className="size-8 text-emerald-500 shrink-0" />
               <p>Оплата происходит через защищенный шлюз Stripe. Мы не храним данные ваших карт.</p>
             </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
