import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TEvent } from "@/entities/event/model";
import Link from "next/link";
import { EventCard } from "@/entities/event/ui";

interface CarouselCompData {
    events: TEvent[],
    heading: string,
    href?: string,
}

export function CarouselComp({events, heading, href = "/"}: CarouselCompData) {
    return (
        <section className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-4">
                <Link href={href} className="w-fit">
                    <h2 className="text-2xl font-bold leading-none">{heading}</h2>
                </Link>
                <Link href={href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                    Смотреть все
                </Link>
            </div>
            <Carousel className="px-12">
                <CarouselContent className="gap-3 -ml-3">
                    { events.map((el,_index) => (
                        <CarouselItem
                            key={_index}
                            className="pl-3 basis-[85%] sm:basis-[60%] md:basis-1/2 lg:basis-1/3"
                        >
                            <Link href={href}>
                                <EventCard event={el}/>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-3 border-[#FF5100]/25 bg-white/70 hover:bg-white" />
                <CarouselNext className="-right-3 border-[#FF5100]/25 bg-white/70 hover:bg-white" />
            </Carousel>
        </section>
    )
}