"use client"

import * as React from "react"
import { addDays, endOfDay, format, isSameDay, isWithinInterval, startOfDay } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { TEvent } from "@/entities/event/model"
import { getDatesWithEvents, toEventDay } from "@/entities/event/lib/filterByDate"

type DatePickerCompProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  /** Все мероприятия города — для подсветки дней с событиями (любой жанр) */
  events?: TEvent[]
  className?: string
}

const buildDays = (from: Date, count: number) =>
  Array.from({ length: count }).map((_, i) => startOfDay(addDays(from, i)))

function useVisibleDaysCount() {
  const [count, setCount] = React.useState(17)

  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w < 480) return 5
      if (w < 640) return 7
      if (w < 1024) return 11
      return 17
    }

    const onResize = () => setCount(compute())
    setCount(compute())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return count
}

export function DatePickerComp({ value, onChange, events = [], className }: DatePickerCompProps) {
  const [open, setOpen] = React.useState(false)
  const [windowStart, setWindowStart] = React.useState(() => startOfDay(new Date()))
  const visibleCount = useVisibleDaysCount()
  const days = React.useMemo(() => buildDays(windowStart, visibleCount), [windowStart, visibleCount])

  const datesWithEvents = React.useMemo(() => getDatesWithEvents(events), [events])

  React.useEffect(() => {
    if (!value) return
    const interval = { start: startOfDay(windowStart), end: endOfDay(addDays(windowStart, visibleCount - 1)) }
    if (!isWithinInterval(value, interval)) setWindowStart(startOfDay(value))
  }, [value, windowStart, visibleCount])

  const monthLabel = format(days[0], "LLLL", { locale: ru })
  const monthLabelNext = format(days[days.length - 1], "LLLL", { locale: ru })

  return (
    <section className={cn("flex flex-col gap-2 w-full", className)}>
      <div className="flex items-end justify-between gap-6">
        <p className="text-[28px] font-semibold tracking-[-0.02em] leading-none">
          Афиша событий
        </p>

        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-9 px-3 rounded-full border bg-white/60 hover:bg-white flex items-center gap-2 transition-colors",
                  value ? "border-primary/50 animate-pulse" : "border-border"
                )}
                aria-label="Открыть календарь"
                title="Календарь"
              >
                <CalendarIcon className="size-4" />
                <span className="text-sm opacity-80">Календарь</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-0">
              <Calendar
                mode="single"
                selected={value ?? undefined}
                onSelect={(d) => {
                  onChange(d ?? null)
                  setOpen(false)
                }}
                modifiers={{
                  hasEvents: (day) => datesWithEvents.has(toEventDay(day).toISOString()),
                }}
                modifiersClassNames={{
                  hasEvents: "relative font-bold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-primary",
                }}
              />
            </PopoverContent>
          </Popover>

          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="h-9 w-9 rounded-full border border-border bg-white/60 hover:bg-white flex items-center justify-center"
              aria-label="Очистить дату"
              title="Очистить"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide opacity-60 px-1">
        <span>{monthLabel}</span>
        <span>{monthLabelNext}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setWindowStart((d) => startOfDay(addDays(d, -Math.max(1, Math.floor(visibleCount / 2)))))}
          className="h-14 w-10 rounded-xl border border-border bg-white/60 hover:bg-white flex items-center justify-center"
          aria-label="Показать предыдущие даты"
          title="Назад"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <div className="flex-1">
          <div className="grid grid-cols-5 min-[480px]:grid-cols-7 sm:grid-cols-11 lg:grid-cols-17 gap-1 sm:gap-2 py-1">
            {days.map((d) => {
              const active = value ? isSameDay(value, d) : false
              const dow = d.getDay()
              const isWeekend = dow === 0 || dow === 6
              const hasEvents = datesWithEvents.has(d.toISOString())
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => onChange(active ? null : d)}
                  className={cn(
                    "relative min-w-9 sm:min-w-10 h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center leading-none transition-colors",
                    "bg-white/60 hover:bg-white",
                    active ? "border-primary bg-primary text-white" : "border-border",
                    !active && hasEvents && "border-primary/45"
                  )}
                >
                  <span className="text-[14px] sm:text-[15px] font-semibold">
                    {format(d, "d", { locale: ru })}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] sm:text-[10px] mt-1",
                      active ? "text-white/90" : isWeekend ? "text-red-500" : "opacity-70"
                    )}
                  >
                    {format(d, "EE", { locale: ru })}
                  </span>
                  {hasEvents && !active && (
                    <span className="absolute bottom-1.5 size-1 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setWindowStart((d) => startOfDay(addDays(d, Math.max(1, Math.floor(visibleCount / 2)))))}
          className="h-14 w-10 rounded-xl border border-border bg-white/60 hover:bg-white flex items-center justify-center"
          aria-label="Показать следующие даты"
          title="Дальше"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </section>
  )
}
