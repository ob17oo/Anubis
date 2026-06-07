'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { eventToSlug } from "@/entities/event/lib/eventSlug"
import { TEvent } from "@/entities/event/model"
import { EventCard } from "@/entities/event/ui"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

export interface EventCarouselSectionProps {
    events: TEvent[]
    title: string
    href?: string
    subtitle?: string
    limit?: number
}

export function EventCarouselSection({
    events,
    title,
    href,
    subtitle = "топ по рейтингу",
    limit,
}: EventCarouselSectionProps) {
    const items = limit ? events.slice(0, limit) : events

    if (items.length === 0) {
        return null
    }

    const heading = href ? (
        <Link href={href} className="group inline-flex items-center gap-2">
            <h2 className="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] leading-none group-hover:opacity-90 transition-opacity">
                {title}
            </h2>
            <ChevronRightIcon className="size-6 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Link>
    ) : (
        <h2 className="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] leading-none">
            {title}
        </h2>
    )

    return (
        <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6">
                {heading}
                {href && (
                    <Link
                        href={href}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity shrink-0"
                    >
                        Смотреть все
                    </Link>
                )}
                {!href && subtitle && (
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide opacity-50">{subtitle}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                )}
            </div>

            <Carousel
                className="mt-6 sm:px-10 md:px-12"
                opts={{ align: "start", loop: items.length > 1 }}
            >
                <CarouselContent className="-ml-3 md:-ml-4">
                    {items.map((event) => (
                        <CarouselItem
                            key={event.id}
                            className="pl-3 md:pl-4 basis-[85%] sm:basis-[55%] md:basis-[42%] lg:basis-[32%] xl:basis-[24%]"
                        >
                            <Link
                                href={`/event/${eventToSlug(event)}`}
                                className="block h-full"
                            >
                                <EventCard event={event} />
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {items.length > 1 && (
                    <>
                        <CarouselPrevious className="hidden sm:inline-flex -left-2 sm:-left-3 border-border bg-surface hover:bg-muted" />
                        <CarouselNext className="hidden sm:inline-flex -right-2 sm:-right-3 border-border bg-surface hover:bg-muted" />
                    </>
                )}
            </Carousel>
        </section>
    )
}
