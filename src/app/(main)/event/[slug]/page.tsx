import Image from "next/image"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon, MapPinIcon, StarIcon, TicketIcon } from "lucide-react"

import { getEventById } from "@/entities/event/api"
import { slugToEventId } from "@/entities/event/lib/eventSlug"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params
  const eventId = slugToEventId(slug)

  let event
  try {
    event = await getEventById(eventId)
  } catch {
    notFound()
  }

  const eventDate = event.date instanceof Date ? event.date : new Date(event.date)

  return (
    <main className="py-10">
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-10">
        <div className="flex flex-col gap-6">
          <div className="relative w-full aspect-video rounded-[28px] overflow-hidden border border-[#FF5100]/20 bg-white shadow-[0_18px_60px_-48px_rgba(0,0,0,0.45)]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0" />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-[38px] sm:text-[44px] font-semibold tracking-[-0.035em] leading-[1.04]">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 opacity-90">
                <CalendarIcon className="size-4 text-[#FF5100]" />
                {format(eventDate, "d MMMM, EEEE", { locale: ru })}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 opacity-90">
                <MapPinIcon className="size-4 text-[#FF5100]" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 opacity-90">
                <StarIcon className="size-4 text-[#FF5100]" />
                {event.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <section className="rounded-[28px] border border-[#FF5100]/12 bg-white/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">О событии</h2>
            <p className="mt-3 text-[15px] sm:text-base opacity-80 leading-relaxed">
              {event.description || "Описание появится позже. Мы добавим детали, как только организатор их подтвердит."}
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[28px] border bg-white/60 p-6">
              <p className="text-xs uppercase tracking-wide opacity-60">Место проведения</p>
              <p className="mt-2 text-lg font-medium">{event.location}</p>
              <p className="mt-3 text-sm opacity-70 leading-relaxed">
                Лучше прийти заранее — комфортно быть на месте за 20–30 минут до начала.
              </p>
            </div>
            <div className="rounded-[28px] border bg-white/60 p-6">
              <p className="text-xs uppercase tracking-wide opacity-60">Дата и время</p>
              <p className="mt-2 text-lg font-medium">
                {format(eventDate, "d MMMM, EEEE", { locale: ru })}
              </p>
              <p className="mt-3 text-sm opacity-70 leading-relaxed">
                Организатор может уточнить тайминг ближе к событию — мы покажем обновления.
              </p>
            </div>
          </section>

          <Accordion
            type="single"
            collapsible
            defaultValue="faq"
            className="rounded-[28px] border bg-white/60 px-6"
          >
            <AccordionItem value="faq">
              <AccordionTrigger>FAQ</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-medium">Как получить билет?</p>
                    <p className="opacity-80">
                      После оплаты он появится в разделе “Мои билеты”. Также отправим подтверждение на почту.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Можно вернуть билет?</p>
                    <p className="opacity-80">
                      Да, если это разрешено условиями организатора. Сроки и правила зависят от мероприятия.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Нужен ли документ?</p>
                    <p className="opacity-80">
                      Иногда — при возрастных ограничениях или именных билетах. Лучше иметь документ с собой.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rules">
              <AccordionTrigger>Правила и условия</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  <li>Билет одноразовый и привязан к заказу.</li>
                  <li>Организатор может менять рассадку/тайминг — мы сообщим в уведомлениях.</li>
                  <li>На входе могут попросить документ при возрастных ограничениях.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <aside className="lg:sticky lg:top-8 h-fit">
          <div className="rounded-[28px] border border-[#FF5100]/18 bg-white/75 p-6 sm:p-7 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.45)]">
            <p className="text-xs uppercase tracking-wide opacity-60">Покупка</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm opacity-70">Цена</p>
                <p className="text-3xl font-semibold tracking-[-0.02em]">{event.price} ₽</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-70">Осталось</p>
                <p className="text-lg font-medium">{event.ticketAmount}</p>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 h-12 w-full rounded-2xl bg-[#FF5100] text-white text-lg font-semibold hover:bg-[#FF5100]/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <TicketIcon className="size-5" />
              Купить билет
            </button>

            <div className="mt-4 rounded-2xl border border-[#FF5100]/12 bg-white/60 p-4">
              <p className="text-sm font-medium">Что дальше?</p>
              <p className="mt-1 text-sm opacity-70 leading-relaxed">
                Билет появится в “Мои билеты” сразу после оплаты. Если событие отменят — поможем с возвратом.
              </p>
            </div>

            <p className="mt-4 text-xs opacity-60 leading-relaxed">
              Нажимая “Купить билет”, ты соглашаешься с условиями сервиса и правилами возврата.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

