'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_CATEGORIES, FAQ_CONTACT } from "./faq.constants"
import { HelpCircleIcon, MailIcon, PhoneIcon, ClockIcon } from "lucide-react"
import Link from "next/link"

export function FaqPage() {
    return (
        <main className="py-8 w-full max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
                <div className="size-12 rounded-2xl border border-primary/25 bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircleIcon className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-semibold tracking-[-0.02em]">Частые вопросы</h1>
                    <p className="mt-2 text-sm opacity-70 leading-relaxed">
                        Ответы о билетах, возвратах, аккаунте и посещении мероприятий в Anubis.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {FAQ_CATEGORIES.map((category) => (
                    <section
                        key={category.id}
                        className="rounded-[28px] border border-border bg-card/75 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden"
                    >
                        <h2 className="px-6 sm:px-8 pt-6 pb-2 text-lg font-semibold tracking-[-0.02em] text-primary">
                            {category.title}
                        </h2>
                        <Accordion
                            type="single"
                            collapsible
                            className="px-6 sm:px-8 pb-4"
                        >
                            {category.items.map((item) => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger className="text-[15px] hover:text-primary transition-colors">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-[15px]">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </section>
                ))}
            </div>

            <section className="mt-8 rounded-[28px] border border-border bg-card/75 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Не нашли ответ?</h2>
                <p className="text-sm opacity-70">
                    Напишите нам или оформите возврат билета в личном кабинете.
                </p>
                <ul className="flex flex-col gap-3 text-sm">
                    <li className="inline-flex items-center gap-2">
                        <MailIcon className="size-4 text-primary" />
                        <a
                            href={`mailto:${FAQ_CONTACT.email}`}
                            className="hover:text-primary transition-colors"
                        >
                            {FAQ_CONTACT.email}
                        </a>
                    </li>
                    <li className="inline-flex items-center gap-2">
                        <PhoneIcon className="size-4 text-primary" />
                        <span>{FAQ_CONTACT.phone}</span>
                    </li>
                    <li className="inline-flex items-center gap-2 opacity-80">
                        <ClockIcon className="size-4 text-primary" />
                        <span>{FAQ_CONTACT.hours}</span>
                    </li>
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                        href="/return-order"
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/30 px-5 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                        Вернуть билет
                    </Link>
                    <Link
                        href="/tech-support"
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground px-5 text-sm font-medium hover:bg-primary/95 transition-colors shadow-lg shadow-primary/20"
                    >
                        Тех. поддержка
                    </Link>
                </div>
            </section>
        </main>
    )
}
