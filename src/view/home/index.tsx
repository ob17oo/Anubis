import { TEvent } from "@/entities/event/model"
import { EventCard, EventCardSkeleton } from "@/entities/event/ui"

interface HomePageProps {
    events: TEvent[],
    error: string | null,
    isLoading: boolean,
    isEmpty: boolean
}

export function HomePage({events,error, isLoading, isEmpty}:HomePageProps){
    return (
        <div>
            <h1>Главная страница</h1>
            {isLoading && (
                <div className="grid grid-cols-3 gap-4">
                    {[...Array(8)].map((_, i) => (
                    <EventCardSkeleton key={i} />
                    ))}
                </div>
            )}
            <div className="grid grid-cols-3 gap-6">
                { events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </div>
    )
}