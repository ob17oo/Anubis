import { TEvent } from "../model"
import { FavoriteButton } from "@/features/favorite/ui/FavoriteButton"
import { EventImage } from "./event-image"

interface EventCardProps {
    event: TEvent
}
export function EventCard({event}:EventCardProps){
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
    return (
        <div className="glass-card flex flex-col h-full relative group rounded-3xl overflow-hidden cursor-pointer">
            <div className="relative w-full aspect-[4/5] overflow-hidden">
                <EventImage 
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                    fill 
                    src={event.imageUrl} 
                    alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                
                <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton eventId={event.id} initialIsFavorite={false} />
                </div>

                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-foreground text-xs font-semibold uppercase tracking-wider border border-border">
                        {event.genre}
                    </span>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                    <h3 className="text-xl sm:text-2xl font-heading font-bold leading-tight text-foreground line-clamp-2">
                        {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-sm font-medium text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5">
                            {eventDate.toLocaleDateString(`ru-RU`, { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1.5 truncate">
                            {event.location}
                        </span>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 pt-3 sm:pt-4 flex items-center justify-between bg-surface backdrop-blur-md">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Билеты от</p>
                    <p className="text-xl font-heading font-bold text-foreground">{event.price} ₽</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors">
                    Купить
                </div>
            </div>
        </div>
    )
}