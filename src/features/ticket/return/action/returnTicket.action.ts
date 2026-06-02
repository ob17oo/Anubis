'use server'

import { createRefundRequestMock, approveRefundRequestMock, rejectRefundRequestMock } from "@/entities/ticket/api/ticket.api"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function createRefundRequestAction(ticketId: string, reason: string) {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        return { success: false as const, error: 'Войдите в аккаунт, чтобы оформить возврат' }
    }

    if (!reason.trim()) {
        return { success: false as const, error: 'Укажите причину возврата билета' }
    }

    try {
        await createRefundRequestMock(session.user.id, ticketId, reason)
        revalidatePath('/tickets')
        revalidatePath('/return-order')
        return { success: true as const }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'UNKNOWN'
        const errorMap: Record<string, string> = {
            TICKET_NOT_FOUND: 'Билет не найден, уже возвращён или отменён',
            REFUND_ALREADY_REQUESTED: 'Вы уже подали заявку на возврат этого билета',
            EVENT_ALREADY_STARTED: 'Возврат невозможен: мероприятие уже началось или прошло',
        }
        return {
            success: false as const,
            error: errorMap[message] ?? 'Не удалось создать запрос на возврат',
        }
    }
}

export async function approveRefundRequestAction(requestId: string) {
    const session = await getServerSession(authOption)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return { success: false as const, error: 'Недостаточно прав для выполнения операции' }
    }

    try {
        await approveRefundRequestMock(requestId)
        revalidatePath('/admin/refunds')
        revalidatePath('/tickets')
        revalidatePath('/return-order')
        return { success: true as const }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'UNKNOWN'
        const errorMap: Record<string, string> = {
            REQUEST_NOT_FOUND: 'Заявка на возврат не найдена',
            REQUEST_ALREADY_PROCESSED: 'Эта заявка уже обработана',
        }
        return {
            success: false as const,
            error: errorMap[message] ?? 'Не удалось одобрить возврат',
        }
    }
}

export async function rejectRefundRequestAction(requestId: string) {
    const session = await getServerSession(authOption)

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return { success: false as const, error: 'Недостаточно прав для выполнения операции' }
    }

    try {
        await rejectRefundRequestMock(requestId)
        revalidatePath('/admin/refunds')
        revalidatePath('/tickets')
        revalidatePath('/return-order')
        return { success: true as const }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'UNKNOWN'
        const errorMap: Record<string, string> = {
            REQUEST_NOT_FOUND: 'Заявка на возврат не найдена',
            REQUEST_ALREADY_PROCESSED: 'Эта заявка уже обработана',
        }
        return {
            success: false as const,
            error: errorMap[message] ?? 'Не удалось отклонить возврат',
        }
    }
}
