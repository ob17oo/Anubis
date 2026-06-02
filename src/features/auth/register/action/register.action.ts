'use server'

import { prisma } from "@/shared/lib"
import { hash } from "bcrypt"
import { registerServerSchema } from "../lib/schema/register.schema"

export async function RegisterAction(data: {
    email: string
    userName: string
    password: string
}) {
    const parsed = registerServerSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false as const,
            error: parsed.error.issues.map((i) => i.message).join(', '),
        }
    }

    const { email, userName, password } = parsed.data

    try {
        const existUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existUser) {
            return { success: false as const, error: 'Пользователь с таким email уже существует' }
        }

        await prisma.user.create({
            data: {
                email,
                userName,
                password: await hash(password, 10),
            },
        })

        return { success: true as const }
    } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`Registration error: ${error}`)
        }
        return {
            success: false as const,
            error: 'Произошла ошибка при регистрации. Повторите позже',
        }
    }
}
