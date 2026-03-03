'use client'
import { useForm } from "react-hook-form"
import { LoginFormData, LoginSchema } from "../lib/schema/login.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { InputComp } from "@/shared/ui"
import { ButtonComp } from "@/shared/ui/ButtonComp"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"

export function LoginForm(){
    const [serverError,setServerError] = useState<string | null>(null)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const handleSubmitForm = async (data:LoginFormData) => {
        try{
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false
            })

            if(result?.error){
                setServerError(`Неправильно введены данные`)
            } else {
                router.push('/')
                router.refresh()
            }

            setServerError('')
        } catch(error: unknown){
            if(error instanceof Error){
                setServerError(error.message)
            }
        }
    }

    return (
    <section className="flex flex-col items-center gap-6">
            <div>
                <Image width={250} height={100} src={'/static/icons/AnubisLogotype.svg'} alt="LoginAnubisLogotype"/>
            </div>
            <div className="w-full max-w-100">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleSubmitForm)}>
                    <div className="relative">
                        <InputComp { ...register('email')} label="Email"/>
                        {errors.email && (
                            <p className="text-[16px] absolute -bottom-6">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <InputComp { ...register('password')} label="Пароль"/>
                        {errors.password && (
                            <p className="text-[16px] absolute -bottom-6">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <ButtonComp disabled={!isValid} type="submit">{isSubmitting ? 'Вход' : 'Войти'}</ButtonComp>
                        <ButtonComp type="button" onClick={() => router.push('/register')}>Создать аккаунт</ButtonComp>
                    </div>
                </form>
            </div>
        </section>
    )
}