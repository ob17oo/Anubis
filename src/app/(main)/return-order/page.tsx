import { getUserTickets } from "@/entities/ticket/api/ticket.api"
import { ReturnOrderPage, type ReturnOrderTicket } from "@/view/return-order"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ReturnOrder() {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/return-order')
    }

    const tickets = await getUserTickets(session.user.id)
    const eligibleTickets = tickets.filter(t => t.status === 'CONFIRMED' && !t.refundRequest)

    const serialized: ReturnOrderTicket[] = eligibleTickets.map((t) => ({
        id: t.id,
        totalPrice: t.totalPrice,
        quantity: t.quantity,
        createdAt: t.createdAt.toISOString(),
        event: {
            id: t.event.id,
            title: t.event.title,
            imageUrl: t.event.imageUrl,
            location: t.event.location || '',
            date: (t.event.date instanceof Date
                ? t.event.date
                : new Date(t.event.date)
            ).toISOString(),
        },
    }))

    return <ReturnOrderPage tickets={serialized} />
}
