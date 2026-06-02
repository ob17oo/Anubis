'use client'

import { useForm } from "react-hook-form"
import { LoginFormData, LoginSchema } from "../lib/schema/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputComp } from "@/shared/ui"
import { ButtonComp } from "@/shared/ui/ButtonComp"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { AuthCard } from "@/features/auth/ui/AuthCard"
import Link from "next/link"

export function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const handleSubmitForm = async (data: LoginFormData) => {
        setServerError(null)
        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                const msg = result.error.includes('AUTHORIZATION_ERROR')
                    ? result.error.split(':').slice(1).join(':').trim()
                    : 'Неверный email или пароль'
                setServerError(msg || 'Неверный email или пароль')
                return
            }

            router.push(callbackUrl)
            router.refresh()
        } catch (error: unknown) {
            if (error instanceof Error) {
                setServerError(error.message)
            }
        }
    }

    return (
        <AuthCard
            title="Вход"
            subtitle="Email и пароль — всё, что нужно для доступа к билетам"
            footer={
                <p className="text-center text-sm opacity-70">
                    Нет аккаунта?{' '}
                    <Link href="/register" className="text-[#FF5100] font-medium hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            }
        >
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleSubmitForm)}>
                <div className="relative pb-1">
                    <InputComp {...register('email')} label="Email" type="email" autoComplete="email" />
                    {errors.email && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div className="relative pb-1">
                    <InputComp
                        {...register('password')}
                        label="Пароль"
                        type="password"
                        autoComplete="current-password"
                    />
                    {errors.password && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.password.message}</p>
                    )}
                </div>
                {serverError && (
                    <p className="text-sm text-[#FF5100] rounded-xl border border-[#FF5100]/20 bg-[#FF5100]/5 px-3 py-2">
                        {serverError}
                    </p>
                )}
                <ButtonComp disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Входим…' : 'Войти'}
                </ButtonComp>
            </form>
        </AuthCard>
    )
}
