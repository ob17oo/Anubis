import Image from "next/image"
import { TEvent } from "../model"

interface EventCardProps {
    event: TEvent
}
export function EventCard({event}:EventCardProps){
    return (
        <div className="flex flex-col gap-4 max-h-120 h-full relative">
            <div className="relative w-full h-80 rounded-2xl border-2 border-[#FF5100] overflow-hidden">
                <Image className="object-cover hover:scale-110 transition-transform duration-300 ease-in-out" fill src={event.imageUrl} alt={event.title}/>
            </div>
            <div className="flex flex-col">
                <h2 className="text-3xl font-semibold">{event.title}</h2>
                <div className="flex gap-3 items-center">
                    <span className="text-lg">{event.date.toLocaleDateString(`ru-RU`,{  day: 'numeric',month: 'long' })}</span>
                    <p>|</p>
                    <span className="text-lg">{event.location}</span>
                </div>
            </div>
            <div className="absolute top-4 right-4 ">
                <button className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105" type="button">
                    <Image width={32} height={32} src={'/static/icons/heart_ghosted.svg'} alt="CardHeart" />
                </button>
            </div>
        </div>
    )
}