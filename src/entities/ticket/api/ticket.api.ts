import { prisma } from "@/shared/lib"
import { TicketStatus } from "../../../../prisma/generated/prisma"

export async function getUserTickets(userId: string) {
    return prisma.ticket.findMany({
        where: {
            userId,
        },
        include: {
            event: true,
            refundRequest: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}

export async function purchaseTicketMock(userId: string, eventId: string, promoCodeStr?: string) {
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    })

    if (!event) {
        throw new Error('EVENT_NOT_FOUND')
    }

    if (event.ticketAmount < 1) {
        throw new Error('SOLD_OUT')
    }

    let finalPrice = event.price
    let validPromoId: string | undefined = undefined

    if (promoCodeStr) {
        const promo = await prisma.promoCode.findUnique({ where: { code: promoCodeStr } })
        if (!promo) throw new Error('INVALID_PROMO')
        if (promo.eventId && promo.eventId !== eventId) throw new Error('INVALID_PROMO')
        if (promo.expiresAt && promo.expiresAt < new Date()) throw new Error('EXPIRED_PROMO')
        if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error('EXPIRED_PROMO')
        
        finalPrice = Math.max(0, event.price - promo.discount)
        validPromoId = promo.id
    }

    const ticket = await prisma.$transaction(async (tx) => {
        const updated = await tx.event.updateMany({
            where: {
                id: eventId,
                ticketAmount: { gte: 1 },
            },
            data: {
                ticketAmount: { decrement: 1 },
            },
        })

        if (updated.count === 0) {
            throw new Error('SOLD_OUT')
        }

        if (validPromoId) {
            await tx.promoCode.update({
                where: { id: validPromoId },
                data: { usedCount: { increment: 1 } }
            })
        }

        const qrCode = crypto.randomUUID()
        return tx.ticket.create({
            data: {
                userId,
                eventId,
                quantity: 1,
                totalPrice: finalPrice,
                status: TicketStatus.CONFIRMED,
                qrCode,
            },
            include: { event: true },
        })
    })

    return ticket
}

export async function createRefundRequestMock(userId: string, ticketId: string, reason: string) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            id: ticketId,
            userId,
            status: TicketStatus.CONFIRMED,
        },
        include: {
            event: true,
            refundRequest: true,
        }
    })

    if (!ticket) {
        throw new Error('TICKET_NOT_FOUND')
    }

    if (ticket.refundRequest) {
        throw new Error('REFUND_ALREADY_REQUESTED')
    }

    const eventDate = ticket.event.date instanceof Date ? ticket.event.date : new Date(ticket.event.date)
    if (eventDate.getTime() <= Date.now()) {
        throw new Error('EVENT_ALREADY_STARTED')
    }

    return prisma.refundRequest.create({
        data: {
            ticketId,
            reason,
            status: 'PENDING',
        }
    })
}

export async function approveRefundRequestMock(requestId: string) {
    const request = await prisma.refundRequest.findUnique({
        where: { id: requestId },
        include: { ticket: true },
    })

    if (!request) {
        throw new Error('REQUEST_NOT_FOUND')
    }

    if (request.status !== 'PENDING') {
        throw new Error('REQUEST_ALREADY_PROCESSED')
    }

    return prisma.$transaction(async (tx) => {
        // Update request status to APPROVED
        const updatedRequest = await tx.refundRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED' },
        })

        // Update ticket status to CANCELLED
        await tx.ticket.update({
            where: { id: request.ticketId },
            data: { status: TicketStatus.CANCELLED },
        })

        // Increment event ticketAmount
        await tx.event.update({
            where: { id: request.ticket.eventId },
            data: { ticketAmount: { increment: request.ticket.quantity } },
        })

        return updatedRequest
    })
}

export async function rejectRefundRequestMock(requestId: string) {
    const request = await prisma.refundRequest.findUnique({
        where: { id: requestId }
    })

    if (!request) {
        throw new Error('REQUEST_NOT_FOUND')
    }

    if (request.status !== 'PENDING') {
        throw new Error('REQUEST_ALREADY_PROCESSED')
    }

    return prisma.refundRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
    })
}

export async function getRefundRequests() {
    return prisma.refundRequest.findMany({
        include: {
            ticket: {
                include: {
                    event: true,
                    user: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    })
}

