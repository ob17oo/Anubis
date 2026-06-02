'use client'

import { useForm } from "react-hook-form"
import { RegisterFormData, registerSchema } from "../lib/schema/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputComp } from "@/shared/ui"
import { ButtonComp } from "@/shared/ui/ButtonComp"
import { useState } from "react"
import { RegisterAction } from "../action/register.action"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { AuthCard } from "@/features/auth/ui/AuthCard"
import Link from "next/link"

export function RegisterForm() {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            userName: '',
            password: '',
            confirmPassword: '',
        },
    })

    const handleSubmitForm = async (data: RegisterFormData) => {
        try {
            setServerError('')
            const result = await RegisterAction({
                email: data.email,
                userName: data.userName,
                password: data.password,
            })

            if (!result.success) {
                setServerError(result.error ?? 'Произошла ошибка, попробуйте позже')
                return
            }

            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResult?.error) {
                router.push('/login')
                return
            }

            router.push('/')
            router.refresh()
        } catch (error: unknown) {
            if (error instanceof Error) {
                setServerError(error.message)
            }
        }
    }

    return (
        <AuthCard
            title="Регистрация"
            subtitle="Создайте аккаунт для покупки билетов и управления заказами"
            footer={
                <p className="text-center text-sm opacity-70">
                    Уже есть аккаунт?{' '}
                    <Link href="/login" className="text-[#FF5100] font-medium hover:underline">
                        Войти
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-5">
                <div>
                    <InputComp {...register('email')} label="Email" type="email" autoComplete="email" />
                    {errors.email && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <InputComp {...register('userName')} label="Имя в профиле" autoComplete="username" />
                    {errors.userName && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.userName.message}</p>
                    )}
                </div>
                <div>
                    <InputComp
                        {...register('password')}
                        label="Пароль"
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.password.message}</p>
                    )}
                </div>
                <div>
                    <InputComp
                        {...register('confirmPassword')}
                        label="Повторите пароль"
                        type="password"
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-[#FF5100] mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>
                {serverError && (
                    <p className="text-sm text-[#FF5100] rounded-xl border border-[#FF5100]/20 bg-[#FF5100]/5 px-3 py-2">
                        {serverError}
                    </p>
                )}
                <ButtonComp disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Создаём…' : 'Зарегистрироваться'}
                </ButtonComp>
            </form>
        </AuthCard>
    )
}
