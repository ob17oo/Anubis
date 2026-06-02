import { isSameDay, startOfDay } from "date-fns"
import { TEvent } from "../model"

export function toEventDay(date: Date | string): Date {
    return startOfDay(date instanceof Date ? date : new Date(date))
}

export function isEventOnDate(eventDate: Date | string, day: Date | null): boolean {
    if (!day) return false
    return isSameDay(toEventDay(eventDate), startOfDay(day))
}

export function filterEventsByDate(events: TEvent[], day: Date | null): TEvent[] {
    if (!day) return events
    return events.filter((e) => isEventOnDate(e.date, day))
}

export function getDatesWithEvents(events: TEvent[]): Set<string> {
    const keys = new Set<string>()
    for (const e of events) {
        keys.add(toEventDay(e.date).toISOString())
    }
    return keys
}
