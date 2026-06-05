'use client'
import { useCityStore } from "@/entities/city/model/city.store";
import { TUserCity } from "@/entities/city/model/city.types";
import { useLockScroll } from "@/shared/hooks/useLockScroll";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LayoutDashboard, Shield } from "lucide-react";

const CityDialogComp = dynamic(() => import("@/widgets/CityComp/ui").then(mod => mod.CityDialogComp), {
    ssr: false,
    loading: () => null
})

const MenuDialogComp = dynamic(() => import("@/widgets/MenuComp/ui").then(mod => mod.MenuDialogComp), {
    ssr: false,
    loading: () => null
})


interface HeaderCompProps {
    session: Session | null
    city: TUserCity[];
}

export function HeaderComp({ session, city }: HeaderCompProps) {
    const selectedCityName = useCityStore((state) => state.selectedCityName)
    const router = useRouter()
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [isOpenCityPicker, setIsOpenCityPicker] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useLockScroll(isOpenCityPicker)

    const user = session?.user
    return (
        <header className="w-full h-20 sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm px-4 md:px-8">
            <div className="h-full flex items-center justify-between gap-4 md:gap-10">
                <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                    <button onClick={() => router.push('/')} className="w-fit cursor-pointer">
                        <Image width={180} height={70} src={'/static/icons/AnubisLogotype.svg'} alt="HeaderLogotype" className="dark:brightness-200 w-28 sm:w-[180px] h-auto" />
                    </button>
                    <nav className="hidden lg:flex items-center gap-6 text-base font-medium border-l border-border pl-6">
                        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Афиша</Link>
                        <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">Вопросы</Link>
                        <Link href="/return-order" className="text-muted-foreground hover:text-foreground transition-colors">Возвраты</Link>
                    </nav>
                </div>
                <div className="w-full flex items-center justify-end">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={() => setIsOpenCityPicker(true)} className="flex items-center gap-1 sm:gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium">
                            <Image width={24} height={24} src={'/static/icons/map-location_accent.svg'} alt="City-Pointer" className="opacity-80 shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-sm sm:text-base tracking-wide max-w-[80px] min-[360px]:max-w-[120px] sm:max-w-none truncate">{isMounted ? selectedCityName : 'Москва'}</span>
                        </button>

                        {isOpenCityPicker && (
                            <CityDialogComp city={city} isOpen={isOpenCityPicker} onClose={() => setIsOpenCityPicker(false)} />
                        )}

                        {user && (
                            <div className="hidden lg:flex items-center gap-6">
                                <button onClick={() => router.push('/profile/favorites')} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium">
                                    <Image width={24} height={24} src={'/static/icons/heart_ghosted.svg'} alt="Header-Favorite" className="opacity-80" />
                                    <span className="text-base tracking-wide">Избранное</span>
                                </button>
                                <button onClick={() => router.push('/profile/tickets')} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium">
                                    <Image width={24} height={24} src={'/static/icons/ticket.svg'} alt="Header-Ticket" className="opacity-80" />
                                    <span className="text-base tracking-wide">Мои билеты</span>
                                </button>
                            </div>
                        )}

                        {user && (user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                            <button onClick={() => router.push('/admin')} className="hidden lg:flex items-center gap-2 cursor-pointer bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all font-medium">
                                <Shield size={16} />
                                <span className="text-base tracking-wide">Админ-панель</span>
                            </button>
                        )}

                        {user && (user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
                            <button onClick={() => router.push('/organizer')} className="hidden lg:flex items-center gap-2 cursor-pointer bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 px-3 py-1.5 rounded-xl transition-all font-medium">
                                <LayoutDashboard size={16} />
                                <span className="text-base tracking-wide">Организатор</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-fit ml-2 sm:ml-4 border-l border-border pl-2 sm:pl-4">
                    <button onClick={() => setIsOpenMenu(true)} type="button" className="cursor-pointer rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors shrink-0">
                        <Image width={40} height={40} src={session?.user?.imageUrl || '/static/default/default-user.svg'} alt="HeaderUserAvatar" className="object-cover w-8 h-8 sm:w-10 sm:h-10" />
                    </button>
                    {isOpenMenu && (
                        <MenuDialogComp
                            isOpen={isOpenMenu}
                            onClose={() => setIsOpenMenu(false)}
                            onOpenCityPicker={() => {
                                setIsOpenMenu(false);
                                setIsOpenCityPicker(true);
                            }}
                        />
                    )}
                </div>
            </div>
        </header>
    )
}