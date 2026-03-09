import { TUserCity } from '@/entities/city/model/city.types'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
            email: string,
            userName: string,
            cityId: string,
            imageUrl: string,
            role: string,
            city: TUserCity
        } & DefaultSession['user']
    } 

    interface User {
        id: string,
        email: string,
        userName: string,
        cityId: string,
        imageUrl: string,
        role: string,
        city: TUserCity
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string,
        email: string,
        userName: string,
        cityId: string,
        imageUrl: string,
        role: string,
        city: TUserCity
    }
}