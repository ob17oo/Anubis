"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ru } from "date-fns/locale"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ru,
  ...props
}: CalendarProps) {
  const mergedClassNames = {
    months: "flex flex-col sm:flex-row gap-4",
    month: "space-y-3",
    // react-day-picker v10 has slightly different typing for classNames keys.
    // We keep our classNames map and let it pass through safely.
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium",
    nav: "space-x-1 flex items-center",
    nav_button: cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      "rounded-full"
    ),
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
    row: "flex w-full mt-1",
    cell:
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-muted [&:has([aria-selected])]:rounded-xl",
    day: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "h-9 w-9 rounded-xl font-normal aria-selected:opacity-100"
    ),
    day_today: "border border-[#FF5100]/40",
    day_selected:
      "bg-[#FF5100] text-white hover:bg-[#FF5100]/90 hover:text-white focus:bg-[#FF5100] focus:text-white",
    day_outside:
      "text-muted-foreground opacity-60 aria-selected:bg-muted aria-selected:text-muted-foreground aria-selected:opacity-60",
    day_disabled: "text-muted-foreground opacity-40",
    day_range_middle: "aria-selected:bg-[#FF5100]/12 aria-selected:text-foreground",
    day_hidden: "invisible",
    ...classNames,
  } as unknown as CalendarProps["classNames"]

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-2", className)}
      classNames={mergedClassNames}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeftIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }

