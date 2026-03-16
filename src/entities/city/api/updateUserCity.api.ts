'use server'
import { prisma } from "@/shared/lib";
import { authOption } from "@/shared/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateUserCity(newCityId: string){
    try {
        const session = await getServerSession(authOption)

        
        const cityExist = await prisma.city.findUnique({
            where: {
                id: newCityId
            }
        })

        if(!cityExist){
            throw new Error(`CITY_NOT_FOUND `)
        }

        if(session?.user.id){
            const updateUser = await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    cityId: newCityId,
                },
                select: {
                    id: true,
                    cityId: true,
                    city: true
                }
            })
            revalidatePath('/', 'layout')

            return {
                success: true,
                city: updateUser.city
            }
        }

        return {
            success: true,
            city: { id: cityExist.id, name: cityExist.name }
        }

    } catch(error: unknown){
        if (process.env.NODE_ENV === 'development') {
            console.error('Error updating user city:', error)
        }

        const errorMessage =
        error instanceof Error
            ? error.message === 'CITY_NOT_FOUND'
            ? 'Город не найден'
            : error.message
            : 'Ошибка при смене города'

        return {
        success: false,
        error: errorMessage
        }
    }
}