import { getServerSession } from "next-auth"
import { authOption } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib"
import { redirect } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { MapPinIcon, CalendarIcon, TicketIcon, QrCodeIcon } from "lucide-react"
import Link from "next/link"

export default async function MyTicketsPage() {
  const session = await getServerSession(authOption)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id },
    include: {
      event: true,
      order: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Мои билеты</h1>
      </div>

      {tickets.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <TicketIcon className="size-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">У вас пока нет билетов</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Выберите интересное мероприятие в нашей афише и билеты появятся здесь
          </p>
          <Link href="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            Перейти к афише
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl transition-all">
              <div className="relative w-full sm:w-40 aspect-video sm:aspect-auto sm:h-full shrink-0">
                <Image
                  src={ticket.event.imageUrl}
                  alt={ticket.event.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-lg line-clamp-2">{ticket.event.title}</h3>
                  <div className="shrink-0 flex items-center gap-1 text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md border border-border">
                    <TicketIcon className="size-3" />
                    {ticket.quantity} шт.
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{format(new Date(ticket.event.date), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-4 shrink-0 text-accent" />
                    <span className="truncate">{ticket.event.location}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Заказ №{ticket.orderId?.slice(-6).toUpperCase()}</span>
                    <span className="text-sm font-medium">{ticket.status === 'CONFIRMED' ? 'Подтвержден' : 'Отменен'}</span>
                  </div>
                  {ticket.qrCode && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors">
                      <QrCodeIcon className="size-4" />
                      Показать код
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
