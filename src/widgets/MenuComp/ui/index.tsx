import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCityStore } from "@/entities/city/model/city.store"
import { LINKS_CONSTANT, OTHER_LINKS } from "../model/popup.constant"

interface PopUpCompProps{
    isOpen: boolean,
    onClose: (value: boolean) => void,
}
export function MenuDialogComp({isOpen, onClose}: PopUpCompProps){
    const router = useRouter()
    const selectedCityName = useCityStore((state) => state.selectedCityName)
    const { data: session} = useSession()

    if(!isOpen) return  

    return (
        <section className="w-full h-screen absolute inset-0 top-5 z-20" onClick={() => onClose(false)}>
            <div className="rounded-2xl w-80 h-fit px-2 py-6 bg-gray-100 absolute right-0">
                <div className="flex flex-col gap-6">
                    { session?.user ? (
                        <div className="flex items-center gap-3 cursor-pointer px-4">
                            <Image width={56} height={56} src={session.user.imageUrl} alt="PopUpUserAvatar"/>
                            <div>
                                <p className="text-2xl text-left">{session.user.userName || 'username'}</p>
                                <span className="text-lg opacity-70 ">{session.user.email}</span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl text-center">Войдите в аккаунт</h2>
                        </div>
                    )}

                    <div className="w-[90%] mx-auto rounded-full h-0.5 bg-[#FF5100]"></div>
                    
                    <button className="flex items-center gap-3 cursor-pointer px-4 hover:bg-gray-200 rounded-2xl h-10">
                        <Image width={24} height={24} src={'/static/icons/map-location_accent.svg'} alt="PopUpLocationIcon"/>
                        <p className="text-xl">{session?.user.city.name || selectedCityName}</p>
                    </button>
                    { session?.user && (
                        LINKS_CONSTANT.map((link, index) => (
                            <Link href={link.path} key={index} className="flex items-center gap-3 cursor-pointer px-4 hover:bg-gray-200 rounded-2xl h-10">
                                <Image width={24} height={24} src={link.iconPath} alt={link.value}/>
                                <p className="text-xl">{link.value}</p>
                            </Link>
                        ))
                    )}
                    <div className="w-[90%] mx-auto rounded-full h-0.5 bg-[#FF5100]"></div>
                    {
                        OTHER_LINKS.map((link, index) => (
                        <Link href={link.path} key={index} className="flex items-center gap-3 cursor-pointer px-4 hover:bg-gray-200 rounded-2xl h-10">
                            <Image width={24} height={24} src={link.iconPath} alt={link.value}/>
                            <p className="text-xl">{link.value}</p>
                        </Link>
                    ))}
                     { session?.user ? (
                        <button onClick={() => signOut()} className="flex text-lg items-center gap-3 cursor-pointer px-4 hover:bg-gray-200 rounded-2xl h-10">
                            Выйти
                        </button>
                     ) : (
                        <button onClick={() => router.push('/login')} className="text-lg bg-[#FF5100] text-white rounded-2xl h-12.5">
                            Войти
                        </button>
                     )}
                </div>
            </div>
        </section>
    )
}