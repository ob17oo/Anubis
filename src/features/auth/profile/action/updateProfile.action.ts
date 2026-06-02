'use server'

import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import z from "zod"

const updateProfileSchema = z.object({
    userName: z
        .string()
        .min(4, { error: 'Имя должно содержать минимум 4 символа' })
        .max(32, { error: 'Имя должно содержать максимум 32 символа' }),
})

export async function updateProfileAction(data: { userName: string }) {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        return { success: false as const, error: 'AUTH_REQUIRED' }
    }

    const parsed = updateProfileSchema.safeParse(data)
    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((i) => i.message).join(', '),
        }
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { userName: parsed.data.userName },
    })

    return { success: true as const }
}
