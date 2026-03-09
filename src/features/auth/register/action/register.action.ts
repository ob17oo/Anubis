'use server'
import { prisma } from "@/shared/lib";
import { hash } from "bcrypt";
import { redirect } from "next/navigation";

export async function RegisterAction(data: {
    email: string,
    userName: string,
    password:string
}){
    const userEmail = data.email as string
    const userLogin = data.userName as string
    const userPassword = data.password as string
    try {
        const existUser = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })

        if(existUser){
            throw new Error(`USER_EXIST`)
        }

        await prisma.user.create({
            data: {
                email: userEmail,
                userName: userLogin,
                password: await hash(userPassword, 10),
            }
        })

        return { success: true }

    } catch(error: unknown){
        if(process.env.NODE_ENV === 'development'){
            console.log(`Error creating user: ${error}`)
        }

        console.log(`Registration error: ${error}`)

        if(error instanceof Error && error.message.includes('уже существует')){
            throw new Error
        }
        throw new Error('Произошла ошибка при регистрации. Повторите позже')
    }
}