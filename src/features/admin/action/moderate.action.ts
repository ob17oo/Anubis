'use server'

import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { EventStatus } from "../../../../prisma/generated/prisma"

export async function moderateEventAction(eventId: string, action: 'approve' | 'reject') {
    const session = await getServerSession(authOption)

    if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
        return { success: false, error: 'FORBIDDEN' }
    }

    try {
        const newStatus = action === 'approve' ? EventStatus.PUBLISHED : EventStatus.DRAFT
        
        await prisma.event.update({
            where: { id: eventId },
            data: { 
                status: newStatus,
                isModerated: action === 'approve'
            }
        })

        revalidatePath('/admin/events')
        revalidatePath('/organizer/events')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'FAILED_TO_MODERATE' }
    }
}
