import { TUserCity } from '@/entities/city/model/city.types'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
            email: string,
            userName: string,
            cityId: string | null,
            imageUrl: string,
            role: string,
            city: TUserCity | null
        } & DefaultSession['user']
    } 

    interface User {
        id: string,
        email: string,
        userName: string,
        cityId: string | null,
        imageUrl: string,
        role: string,
        city: TUserCity | null
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string,
        email: string,
        userName: string,
        cityId: string | null,
        imageUrl: string,
        role: string,
        city: TUserCity | null
    }
}