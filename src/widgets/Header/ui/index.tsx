
import { InputComp } from "@/shared/ui";
import Image from "next/image";

export function HeaderComp(){
    return (
        <header className="w-full h-25.5">
            <div className="h-full flex items-center justify-between gap-10">
                <div className="w-fit">
                    <Image width={250} height={100} src={'/static/icons/AnubisLogotype.svg'} alt="HeaderLogotype"/>
                </div>
                <div className="w-full flex items-center justify-between">
                    <div className="max-w-90 w-full">
                        <InputComp label="Поиск" icon="/static/icons/search.svg"/>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-1.5 cursor-pointer">
                            <Image width={28} height={28} src={'/static/icons/map-location.svg'} alt="City-Pointer"/>
                            <span className="text-lg">Ростов-на-Дону</span>
                        </button>
                        <button className="flex items-center gap-1.5 cursor-pointer">
                            <Image width={28} height={28} src={'/static/icons/ticket.svg'} alt="Header-Ticket"/>
                            <span className="text-lg">Мои билеты</span>
                        </button>
                    </div>
                </div>
                <div className="w-fit">
                    <button type="button" className="cursor-pointer">
                        <div className="w-14 h-14 rounded-full bg-[#FF5100]"></div>
                    </button>
                </div>
            </div>
        </header>
    )
}