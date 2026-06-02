'use client'

import { USER_ROLE } from "../../../prisma/generated/prisma"
import { updateProfileAction } from "@/features/auth/profile/action/updateProfile.action"
import { ButtonComp } from "@/shared/ui/ButtonComp"
import { InputComp } from "@/shared/ui"
import { Session } from "next-auth"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

const ROLE_LABELS: Record<string, string> = {
    [USER_ROLE.USER]: 'Пользователь',
    [USER_ROLE.ADMIN]: 'Администратор',
    [USER_ROLE.MODERATOR]: 'Модератор',
}

interface ProfilePageProps {
    session: Session
}

export function ProfilePage({ session: initialSession }: ProfilePageProps) {
    const { data: session, update } = useSession()
    const router = useRouter()
    const user = session?.user ?? initialSession.user
    const [userName, setUserName] = useState(user.userName)
    const [message, setMessage] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSave = () => {
        setMessage(null)
        startTransition(async () => {
            const result = await updateProfileAction({ userName })
            if (result.success) {
                await update()
                setMessage('Профиль обновлён')
                router.refresh()
            } else {
                setMessage(result.error ?? 'Ошибка сохранения')
            }
        })
    }

    return (
        <main className="py-8 max-w-3xl mx-auto w-full">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] mb-8">Профиль</h1>

            <div className="rounded-[28px] border border-[#FF5100]/15 bg-white/70 p-6 sm:p-8 shadow-[0_8px_28px_-24px_rgba(0,0,0,0.35)] flex flex-col gap-8">
                <div className="flex items-center gap-5">
                    <div className="relative size-20 rounded-2xl border-2 border-[#FF5100]/30 overflow-hidden shrink-0">
                        <Image
                            src={user.imageUrl || '/static/default/default-user.svg'}
                            alt={user.userName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold">{user.userName}</p>
                        <p className="text-sm opacity-70">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[#FF5100]/10 bg-white/60 p-4">
                        <p className="text-xs uppercase tracking-wide opacity-60">Роль</p>
                        <p className="mt-1 font-medium">
                            {ROLE_LABELS[user.role] ?? user.role}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-[#FF5100]/10 bg-white/60 p-4">
                        <p className="text-xs uppercase tracking-wide opacity-60">Город</p>
                        <p className="mt-1 font-medium">{user.city?.name ?? '—'}</p>
                    </div>
                    <div className="rounded-2xl border border-[#FF5100]/10 bg-white/60 p-4 sm:col-span-2">
                        <p className="text-xs uppercase tracking-wide opacity-60">ID аккаунта</p>
                        <p className="mt-1 font-mono text-sm opacity-80 break-all">{user.id}</p>
                    </div>
                </div>

                <section className="flex flex-col gap-4 pt-2 border-t border-[#FF5100]/10">
                    <h2 className="text-lg font-semibold">Редактирование</h2>
                    <div className="relative max-w-md">
                        <InputComp
                            label="Отображаемое имя"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    {message && (
                        <p className={`text-sm ${message.includes('обновлён') ? 'text-emerald-700' : 'text-[#FF5100]'}`}>
                            {message}
                        </p>
                    )}
                    <div className="max-w-xs">
                        <ButtonComp
                            type="button"
                            onClick={handleSave}
                            disabled={isPending || userName.length < 4}
                        >
                            {isPending ? 'Сохраняем…' : 'Сохранить'}
                        </ButtonComp>
                    </div>
                </section>
            </div>
        </main>
    )
}
