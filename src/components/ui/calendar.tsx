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
    months: "flex flex-col sm:flex-row gap-4 justify-center",
    month: "space-y-4",
    month_caption: "flex justify-center pt-1 relative items-center mb-4",
    caption_label: "text-sm font-semibold text-foreground",
    nav: "flex items-center justify-between w-full absolute bottom-3 left-0 right-0 px-3 z-10 pointer-events-none",
    button_previous: cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      "rounded-full cursor-pointer pointer-events-auto"
    ),
    button_next: cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      "rounded-full cursor-pointer pointer-events-auto"
    ),
    month_grid: "w-full border-collapse",
    weekdays: "",
    weekday: "text-muted-foreground text-xs font-semibold text-center pb-2 uppercase tracking-wider",
    week: "",
    day: "p-0 text-center relative",
    day_button: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "h-9 w-9 rounded-xl font-normal aria-selected:opacity-100 cursor-pointer flex items-center justify-center mx-auto text-sm"
    ),
    today: "border border-primary/50 text-primary font-semibold rounded-xl",
    selected: "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-xl",
    outside: "text-muted-foreground opacity-40",
    disabled: "text-muted-foreground opacity-20",
    hidden: "invisible",
    ...classNames,
  } as unknown as CalendarProps["classNames"]

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-3 pb-14 relative", className)}
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

