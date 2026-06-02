import { FAQ_CONTACT } from "@/view/faq/faq.constants"
import { HeadphonesIcon, MailIcon, PhoneIcon, ClockIcon } from "lucide-react"
import Link from "next/link"

export function SupportPage() {
    return (
        <main className="py-8 w-full max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
                <div className="size-12 rounded-2xl border border-[#FF5100]/25 bg-[#FF5100]/10 flex items-center justify-center shrink-0">
                    <HeadphonesIcon className="size-6 text-[#FF5100]" />
                </div>
                <div>
                    <h1 className="text-3xl font-semibold tracking-[-0.02em]">Тех. поддержка</h1>
                    <p className="mt-2 text-sm opacity-70 leading-relaxed">
                        Поможем с заказами, возвратами и вопросами по мероприятиям.
                    </p>
                </div>
            </div>

            <div className="rounded-[28px] border border-[#FF5100]/15 bg-white/70 p-6 sm:p-8 flex flex-col gap-6 shadow-[0_8px_28px_-24px_rgba(0,0,0,0.35)]">
                <ul className="flex flex-col gap-4 text-[15px]">
                    <li className="flex items-center gap-3">
                        <MailIcon className="size-5 text-[#FF5100]" />
                        <a
                            href={`mailto:${FAQ_CONTACT.email}`}
                            className="hover:text-[#FF5100] transition-colors"
                        >
                            {FAQ_CONTACT.email}
                        </a>
                    </li>
                    <li className="flex items-center gap-3">
                        <PhoneIcon className="size-5 text-[#FF5100]" />
                        <span>{FAQ_CONTACT.phone}</span>
                    </li>
                    <li className="flex items-center gap-3 opacity-80">
                        <ClockIcon className="size-5 text-[#FF5100]" />
                        <span>{FAQ_CONTACT.hours}</span>
                    </li>
                </ul>
                <p className="text-sm opacity-70 leading-relaxed">
                    Перед обращением загляните в{' '}
                    <Link href="/faq" className="text-[#FF5100] font-medium hover:underline">
                        частые вопросы
                    </Link>
                    — возможно, ответ уже есть.
                </p>
                <Link
                    href="/return-order"
                    className="inline-flex h-11 w-fit items-center justify-center rounded-2xl bg-[#FF5100] px-6 text-sm font-medium text-white hover:bg-[#FF5100]/90 transition-colors"
                >
                    Вернуть билет
                </Link>
            </div>
        </main>
    )
}
