import Image from "next/image"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, StarIcon, ClockIcon } from "lucide-react"
import { EventImage } from "@/entities/event/ui/event-image"

import { getEventBySlug } from "@/entities/event/api"
import { eventToSlug } from "@/entities/event/lib/eventSlug"
import { BuyTicketButton } from "@/features/ticket/purchase/ui/BuyTicketButton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FavoriteButton } from "@/features/favorite/ui/FavoriteButton"
import { ReviewForm } from "@/features/review/ui/ReviewForm"
import { ReviewList } from "@/features/review/ui/ReviewList"
import { getServerSession } from "next-auth"
import { authOption } from "@/shared/lib/auth"
import { prisma } from "@/shared/lib"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params

  let event
  try {
    event = await getEventBySlug(slug)
  } catch {
    notFound()
  }

  const eventDate = event.date instanceof Date ? event.date : new Date(event.date)

  const session = await getServerSession(authOption)
  let initialIsFavorite = false
  if (session?.user?.id) {
      const favorite = await prisma.favorite.findUnique({
          where: { userId_eventId: { userId: session.user.id, eventId: event.id } }
      })
      initialIsFavorite = !!favorite
  }

  // Fetch reviews for the event
  const reviews = await prisma.review.findMany({
    where: { eventId: event.id },
    include: {
      user: {
        select: {
          userName: true,
          imageUrl: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <main className="py-6 sm:py-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 sm:gap-10">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="relative -mx-3 sm:mx-0 aspect-[4/5] sm:aspect-video rounded-none sm:rounded-3xl overflow-hidden sm:glass-panel group sm:shadow-2xl">
            <EventImage
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute top-4 sm:top-6 left-3 sm:left-6 flex flex-wrap gap-2 pr-16 sm:pr-20">
                <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium uppercase tracking-wide shadow-sm">
                    {event.genre}
                </span>
                {event.ageRestriction && (
                    <span className="px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-foreground text-xs sm:text-sm font-medium border border-border shadow-sm">
                        {event.ageRestriction}
                    </span>
                )}
            </div>
            <div className="absolute top-4 sm:top-6 right-3 sm:right-6 z-10">
                <FavoriteButton 
                    eventId={event.id} 
                    initialIsFavorite={initialIsFavorite} 
                    pathToRevalidate={`/event/${slug}`}
                />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="display-text text-foreground">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 shadow-sm">
                <CalendarIcon className="size-4 text-primary" />
                {format(eventDate, "d MMMM, EEEE", { locale: ru })}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 shadow-sm">
                <MapPinIcon className="size-4 text-accent" />
                {event.location}
              </span>
              {event.duration && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 shadow-sm">
                    <ClockIcon className="size-4 text-chart-2" />
                    {event.duration} мин.
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 shadow-sm">
                <StarIcon className="size-4 text-yellow-500" />
                {event.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <section className="glass-panel p-6 sm:p-8 rounded-3xl">
            <h2 className="mb-4">О событии</h2>
            <p className="text-body text-muted-foreground whitespace-pre-wrap">
              {event.description || "Описание появится позже. Мы добавим детали, как только организатор их подтвердит."}
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl hover:border-primary/50 transition-colors">
              <p className="label-text mb-2">Место проведения</p>
              <p className="text-xl font-heading font-semibold">{event.location}</p>
              <p className="caption-text mt-3">
                Рекомендуем приходить за 20–30 минут до начала для комфортного прохода.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-3xl hover:border-accent/50 transition-colors">
              <p className="label-text mb-2">Дата и время</p>
              <p className="text-xl font-heading font-semibold">
                {format(eventDate, "d MMMM, EEEE", { locale: ru })}
              </p>
              <p className="caption-text mt-3">
                Следите за обновлениями, организатор может уточнить тайминг.
              </p>
            </div>
          </section>

          <Accordion
            type="single"
            collapsible
            defaultValue="faq"
            className="glass-panel px-6 rounded-3xl"
          >
            <AccordionItem value="faq" className="border-b-border">
              <AccordionTrigger className="font-heading text-lg">FAQ</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Как получить билет?</p>
                    <p>После оплаты он появится в разделе “Мои билеты”. Также отправим подтверждение на почту.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Можно вернуть билет?</p>
                    <p>Да, если это разрешено условиями организатора. Сроки и правила зависят от мероприятия.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Нужен ли документ?</p>
                    <p>Иногда — при возрастных ограничениях или именных билетах. Лучше иметь документ с собой.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rules" className="border-none">
              <AccordionTrigger className="font-heading text-lg">Правила и условия</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 flex flex-col gap-2 text-muted-foreground">
                  <li>Билет одноразовый и привязан к заказу.</li>
                  <li>Организатор может менять рассадку/тайминг — мы сообщим в уведомлениях.</li>
                  <li>На входе могут попросить документ при возрастных ограничениях.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <ReviewList reviews={reviews} averageRating={event.rating} />
          <ReviewForm eventId={event.id} />
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full z-0 pointer-events-none"></div>
            
            <p className="label-text relative z-10 text-primary">Покупка билета</p>
            
            <div className="relative z-10">
              <BuyTicketButton
                eventId={event.id}
                eventSlug={eventToSlug({ id: event.id, title: event.title })}
                ticketTypes={event.ticketTypes || []}
              />
            </div>

            <div className="rounded-2xl bg-secondary/30 border border-border p-4 relative z-10">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <StarIcon className="size-4 text-primary" />
                Безопасная сделка
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Гарантия подлинности билета и защита возврата средств при отмене мероприятия.
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground/60 text-center relative z-10">
              Нажимая “Купить билет”, вы соглашаетесь с офертой.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
