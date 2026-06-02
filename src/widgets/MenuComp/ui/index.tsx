"use client";

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCityStore } from "@/entities/city/model/city.store"
import { LINKS_CONSTANT, OTHER_LINKS } from "../model/popup.constant"
import { LayoutDashboard, Shield, LogOut, LogIn, MapPin } from "lucide-react"
import { useEffect, useRef } from "react"
import { useLockScroll } from "@/shared/hooks/useLockScroll"

interface PopUpCompProps {
    isOpen: boolean,
    onClose: (value: boolean) => void,
    onOpenCityPicker?: () => void,
}

export function MenuDialogComp({ isOpen, onClose, onOpenCityPicker }: PopUpCompProps) {
    const router = useRouter()
    const selectedCityName = useCityStore((state) => state.selectedCityName)
    const { data: session } = useSession()
    const dialogRef = useRef<HTMLDialogElement>(null)

    useLockScroll(isOpen)

    // Manage native dialog open/close state
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    // Handle close from native dialog escape key
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            onClose(false);
        };

        dialog.addEventListener("close", handleClose);
        return () => dialog.removeEventListener("close", handleClose);
    }, [onClose]);

    // Light dismiss
    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            onClose(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="backdrop:bg-black/10 backdrop:backdrop-blur-sm open:animate-in open:slide-in-from-top-4 open:fade-in-0 bg-transparent p-0 border-none outline-none m-0 ml-auto mr-4 mt-24 fixed sm:absolute inset-auto right-4 top-24 z-50"
        >
            <div className="glass-card rounded-3xl w-[90vw] max-w-[320px] sm:w-80 h-fit px-3 py-6 relative overflow-hidden text-card-foreground shadow-2xl">
                <div className="flex flex-col gap-2">
                    {session?.user ? (
                        <Link
                            href="/profile"
                            onClick={() => onClose(false)}
                            className="flex items-center gap-4 cursor-pointer px-4 hover:bg-secondary/60 rounded-2xl py-3 transition-colors group"
                        >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                                <Image fill className="object-cover" src={session.user.imageUrl || '/static/images/default-avatar.png'} alt="PopUpUserAvatar" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <p className="text-lg font-bold truncate">{session.user.userName || 'Пользователь'}</p>
                                <span className="text-sm text-muted-foreground truncate">{session.user.email}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className="px-4 py-2">
                            <h2 className="text-xl font-bold text-center">Войдите в аккаунт</h2>
                            <p className="text-sm text-muted-foreground text-center mt-1">Чтобы получить доступ ко всем функциям</p>
                        </div>
                    )}

                    <div className="w-[90%] mx-auto rounded-full h-[1px] bg-border/60 my-2"></div>

                    <button onClick={onOpenCityPicker} className="flex items-center gap-3 cursor-pointer px-4 hover:bg-secondary/60 rounded-2xl h-12 transition-colors">
                        <Image width={24} height={24} src={'/static/icons/map-location_accent.svg'} alt="City-Pointer" className="opacity-80" />
                        <p className="text-base font-medium">{session?.user?.city?.name || selectedCityName}</p>
                    </button>

                    {session?.user && (session.user.role === 'ADMIN' || session.user.role === 'MODERATOR' || session.user.role === 'ORGANIZER') && (
                        <div className="flex flex-col gap-2 px-1">
                            {(session.user.role === 'ADMIN' || session.user.role === 'MODERATOR') && (
                                <Link
                                    href="/admin"
                                    onClick={() => onClose(false)}
                                    className="flex items-center gap-3 cursor-pointer px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl h-12 border border-primary/20 transition-all shadow-sm"
                                >
                                    <Shield size={18} className="text-primary" />
                                    <p className="text-base font-bold">Админ-панель</p>
                                </Link>
                            )}
                            {(session.user.role === 'ORGANIZER' || session.user.role === 'ADMIN') && (
                                <Link
                                    href="/organizer"
                                    onClick={() => onClose(false)}
                                    className="flex items-center gap-3 cursor-pointer px-4 bg-accent/10 text-accent hover:bg-accent/20 rounded-2xl h-12 border border-accent/20 transition-all shadow-sm"
                                >
                                    <LayoutDashboard size={18} className="text-accent" />
                                    <p className="text-base font-bold">Кабинет организатора</p>
                                </Link>
                            )}
                            <div className="w-[94%] mx-auto rounded-full h-[1px] bg-border/60 my-2"></div>
                        </div>
                    )}

                    {session?.user && (
                        <div className="flex flex-col gap-1">
                            {LINKS_CONSTANT.map((link, index) => (
                                <Link href={link.path} key={index} onClick={() => onClose(false)} className="flex items-center gap-3 cursor-pointer px-4 hover:bg-secondary/60 rounded-2xl h-12 transition-colors">
                                    <Image width={20} height={20} src={link.iconPath} alt={link.value} className="opacity-80" />
                                    <p className="text-base font-medium">{link.value}</p>
                                </Link>
                            ))}
                            <div className="w-[90%] mx-auto rounded-full h-[1px] bg-border/60 my-2"></div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        {OTHER_LINKS.map((link, index) => (
                            <Link href={link.path} key={index} onClick={() => onClose(false)} className="flex items-center gap-3 cursor-pointer px-4 hover:bg-secondary/60 rounded-2xl h-12 transition-colors">
                                <Image width={20} height={20} src={link.iconPath} alt={link.value} className="opacity-80" />
                                <p className="text-base font-medium">{link.value}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-2 px-1">
                        {session?.user ? (
                            <button
                                onClick={() => {
                                    onClose(false);
                                    signOut();
                                }}
                                className="flex w-full text-base font-medium text-destructive items-center justify-center gap-2 cursor-pointer hover:bg-destructive/10 rounded-2xl h-12 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Выйти
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onClose(false);
                                    router.push('/login');
                                }}
                                className="flex w-full text-base items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl h-12 cursor-pointer transition-colors shadow-md hover:shadow-lg"
                            >
                                <LogIn className="w-5 h-5" />
                                Войти
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </dialog>
    )
}