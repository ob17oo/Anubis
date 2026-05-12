"use client"

import * as React from "react"
import { addDays, endOfDay, format, isSameDay, isWithinInterval, startOfDay } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerCompProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  className?: string
}

const buildDays = (from: Date, count: number) =>
  Array.from({ length: count }).map((_, i) => startOfDay(addDays(from, i)))

function useVisibleDaysCount() {
  const [count, setCount] = React.useState(17)

  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
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

export function DatePickerComp({ value, onChange, className }: DatePickerCompProps) {
  const [open, setOpen] = React.useState(false)
  const [windowStart, setWindowStart] = React.useState(() => startOfDay(new Date()))
  const visibleCount = useVisibleDaysCount()
  const days = React.useMemo(() => buildDays(windowStart, visibleCount), [windowStart, visibleCount])

  React.useEffect(() => {
    if (!value) return
    const interval = { start: startOfDay(windowStart), end: endOfDay(addDays(windowStart, visibleCount - 1)) }
    if (!isWithinInterval(value, interval)) setWindowStart(startOfDay(value))
  }, [value, windowStart, visibleCount])

  const monthLabel = format(days[0], "LLLL", { locale: ru })
  const monthLabelNext = format(days[days.length - 1], "LLLL", { locale: ru })

  return (
    <section className={cn("flex flex-col gap-2", className)}>
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
                  value ? "border-[#FF5100]/50" : "border-border"
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
          <div className="grid grid-cols-7 sm:grid-cols-11 lg:grid-cols-17 gap-2 py-1">
            {days.map((d) => {
              const active = value ? isSameDay(value, d) : false
              const dow = d.getDay()
              const isWeekend = dow === 0 || dow === 6
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => onChange(active ? null : d)}
                  className={cn(
                    "min-w-10 h-14 rounded-xl border flex flex-col items-center justify-center leading-none transition-colors",
                    "bg-white/60 hover:bg-white",
                    active ? "border-[#FF5100] bg-[#FF5100] text-white" : "border-border"
                  )}
                >
                  <span className="text-[15px] font-semibold">
                    {format(d, "d", { locale: ru })}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] mt-1",
                      active ? "text-white/90" : isWeekend ? "text-red-500" : "opacity-70"
                    )}
                  >
                    {format(d, "EE", { locale: ru })}
                  </span>
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

