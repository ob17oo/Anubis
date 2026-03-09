'use client'

import { SessionProvider as SessionProv} from "next-auth/react"

export function SessionProvider({ children }: {children: React.ReactNode}){
    return (
        <SessionProv>
            {children}
        </SessionProv>
    )
}