'use server'

import { purchaseTicketMock } from "@/entities/ticket/api/ticket.api"
import { authOption } from "@/shared/lib/auth"
import { purchaseRateLimiter } from "@/shared/lib/rateLimit"
import { getServerSession } from "next-auth"
import { z } from "zod"

const purchaseSchema = z.object({
    eventId: z.string().cuid('Неверный формат ID события'),
    promoCode: z.string().optional()
})

export async function purchaseTicketAction(eventId: string, promoCode?: string) {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        return { success: false as const, error: 'AUTH_REQUIRED' }
    }

    if (!purchaseRateLimiter.check(session.user.id)) {
        return { success: false as const, error: 'Слишком много запросов. Подождите минуту.' }
    }

    const validated = purchaseSchema.safeParse({ eventId, promoCode })
    if (!validated.success) {
        return { success: false as const, error: validated.error.issues[0].message }
    }

    try {
        const ticket = await purchaseTicketMock(session.user.id, eventId, promoCode)
        return { success: true as const, ticket }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'UNKNOWN'
        const errorMap: Record<string, string> = {
            EVENT_NOT_FOUND: 'Событие не найдено',
            SOLD_OUT: 'Билеты закончились',
            ALREADY_PURCHASED: 'Вы уже купили билет на это событие',
            INVALID_PROMO: 'Неверный промокод',
            EXPIRED_PROMO: 'Промокод истек или исчерпан лимит'
        }
        return {
            success: false as const,
            error: errorMap[message] ?? 'Не удалось оформить покупку',
        }
    }
}

export async function checkPromoCodeAction(code: string, eventId: string) {
    const { prisma } = await import("@/shared/lib/prisma")
    try {
        const promo = await prisma.promoCode.findUnique({ where: { code } })
        if (!promo) return { success: false as const, error: 'Неверный промокод' }
        if (promo.eventId && promo.eventId !== eventId) return { success: false as const, error: 'Промокод не применим к этому событию' }
        if (promo.expiresAt && promo.expiresAt < new Date()) return { success: false as const, error: 'Промокод истек' }
        if (promo.maxUses && promo.usedCount >= promo.maxUses) return { success: false as const, error: 'Промокод исчерпан' }
        
        return { success: true as const, discount: promo.discount }
    } catch {
        return { success: false as const, error: 'Ошибка проверки промокода' }
    }
}
