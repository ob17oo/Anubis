import { TEvent } from "@/entities/event/model"
import { EventCard } from "@/entities/event/ui"

interface HomePageProps {
    events: TEvent[]
}

export function HomePage({events}:HomePageProps){
    return (
        <div>
            <h1>Главная страница</h1>
            <div className="grid grid-cols-3 gap-6">
                { events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
                { events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
                { events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </div>
    )
}