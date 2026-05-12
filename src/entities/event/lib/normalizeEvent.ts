import { TEvent } from "../model"

export function normalizeEventDates(events: TEvent[]): TEvent[] {
  return events.map((e) => ({
    ...e,
    date: e.date instanceof Date ? e.date : new Date(e.date),
  }))
}

