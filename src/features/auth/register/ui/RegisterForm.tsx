'use client'
import { useForm } from "react-hook-form"
import { RegisterFormData, registerSchema } from "../lib/schema/register.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { InputComp } from "@/shared/ui"
import { ButtonComp } from "@/shared/ui/ButtonComp"
import { useState } from "react"
import { RegisterAction } from "../action/register.action"
import { useRouter } from "next/navigation"

export function RegisterForm(){
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        reset,
        formState: { isValid, errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            userName: '',
            password: '',
            confirmPassword: ''
        }
    })

    const handleSubmitForm = async (data: RegisterFormData) => {
        try {
            setServerError('')
            await RegisterAction(data)
            reset()
        } catch(error: unknown){
            if(error instanceof Error){
                if(error.message.includes('NEXT_REDIRECT')){
                    router.push('/')
                    return
                }
                setServerError(error.message)
            }
        }
    }

    return (
        <section className="flex flex-col items-center gap-6">
            <div>
                <Image width={250} height={100} src={'/static/icons/AnubisLogotype.svg'} alt="RegisterAnubisLogotype"/>
            </div>
            <div className="w-full max-w-100">
                <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col gap-8">
                    <div className="relative">
                        <InputComp {...register('email')} label="Введите Emal"/>
                        { errors.email && (
                            <p className="text-[16px] absolute -bottom-6">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <InputComp {...register('userName')} label="Введите логин"/>
                        { errors.userName && (
                            <p className="text-[16px] absolute -bottom-6">{errors.userName.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <InputComp {...register("password")} label="Введите пароль"/>
                        { errors.password && (
                            <p className="text-[16px] absolute -bottom-6">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="relative">
                        <InputComp {...register('confirmPassword')} label="Повторите пароль"/>
                        { errors.confirmPassword && (
                            <p className="text-[16px] absolute -bottom-6">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <ButtonComp disabled={!isValid} type="submit">Зарегистрироваться</ButtonComp>
                    </div>
                </form>
            </div>
        </section>
    )
}