import Image from "next/image"
import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

const FOOTER_LINKS = [
  { label: "Концерты", href: "/concert" },
  { label: "Театр", href: "/theater" },
  { label: "Кино", href: "/cinema" },
  { label: "Спорт", href: "/sport" },
  { label: "Стендап", href: "/standup" },
  { label: "Детям", href: "/kids" },
]

const SERVICE_LINKS = [
  { label: "Войти", href: "/login" },
  { label: "Регистрация", href: "/register" },
  { label: "Мои билеты", href: "/order" },
]

export function FooterComp() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 w-full">
      <div className="w-full border-t border-[#FF5100]/15 bg-linear-to-b from-white to-white/70">
        <div className="w-full">
          {/* Одна горизонтальная полоса: блоки распределены по ширине */}
          <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-10 py-10">
            <div className="flex min-w-[200px] max-w-[320px] flex-col gap-3">
              <Link href="/" className="w-fit shrink-0">
                <Image
                  width={200}
                  height={76}
                  src={"/static/icons/AnubisLogotype.svg"}
                  alt="Anubis"
                />
              </Link>
              <p className="text-sm opacity-75 leading-relaxed">
                Афиша мероприятий в вашем городе: категории, даты и покупка билетов без лишнего шума.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-2 opacity-80">
                  <MapPinIcon className="size-4 shrink-0 text-[#FF5100]" />
                  Россия
                </span>
                <span className="inline-flex items-center gap-2 opacity-80">
                  <MailIcon className="size-4 shrink-0 text-[#FF5100]" />
                  support@anubis.local
                </span>
                <span className="inline-flex items-center gap-2 opacity-80">
                  <PhoneIcon className="size-4 shrink-0 text-[#FF5100]" />
                  +7 (000) 000‑00‑00
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-start justify-evenly gap-x-8 gap-y-8 lg:justify-end lg:gap-x-12">
              <div className="min-w-[140px]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-55">
                  Категории
                </p>
                <nav className="flex flex-row flex-wrap gap-x-5 gap-y-2 text-sm">
                  {FOOTER_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="whitespace-nowrap opacity-75 hover:opacity-100 hover:text-[#FF5100] transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="min-w-[160px]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-55">
                  Сервис
                </p>
                <nav className="flex flex-row flex-wrap gap-x-5 gap-y-2 text-sm">
                  {SERVICE_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="whitespace-nowrap opacity-75 hover:opacity-100 hover:text-[#FF5100] transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/"
                    className="whitespace-nowrap opacity-75 hover:opacity-100 hover:text-[#FF5100] transition-colors"
                  >
                    Конфиденциальность
                  </Link>
                  <Link
                    href="/"
                    className="whitespace-nowrap opacity-75 hover:opacity-100 hover:text-[#FF5100] transition-colors"
                  >
                    Условия
                  </Link>
                </nav>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#FF5100]/12 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs opacity-60">© {year} Anubis</p>
            <p className="text-xs opacity-60">
              Акцент бренда <span className="text-[#FF5100]">#FF5100</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
