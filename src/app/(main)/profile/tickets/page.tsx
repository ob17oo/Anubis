import { getServerSession } from "next-auth"
import { authOption } from "@/shared/lib/auth"
import { redirect } from "next/navigation"
import { TicketIcon } from "lucide-react"
import Link from "next/link"
import { getUserTickets } from "@/entities/ticket/api/ticket.api"
import { TicketList } from "@/features/ticket/list/ui/TicketList"

export default async function MyTicketsPage() {
  const session = await getServerSession(authOption)
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const tickets = await getUserTickets(session.user.id)

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
        <TicketList tickets={tickets} />
      )}
    </div>
  )
}
