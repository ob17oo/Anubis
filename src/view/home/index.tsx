import { GetAllEvents } from "@/entities/event/api"
import { EventCard } from "@/entities/event/ui"

export async function HomePage(){
    const events = await GetAllEvents()
    return (
        <div>
            <h1>Главная страница</h1>
            <div className="grid grid-cols-3 gap-6">
                { events.map((event) => (
                    <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </div>
    )
}