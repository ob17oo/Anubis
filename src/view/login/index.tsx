import { LoginForm } from "@/features/auth/login/ui"
import { Suspense } from "react"

export function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center py-20 opacity-70">Загрузка…</div>}>
            <LoginForm />
        </Suspense>
    )
}
