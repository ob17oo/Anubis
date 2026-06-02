import Image from "next/image"
import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

const CATEGORY_LINKS = [
  { label: "Концерты", href: "/events/concert" },
  { label: "Театр", href: "/events/theater" },
  { label: "Кино", href: "/events/cinema" },
  { label: "Спорт", href: "/events/sport" },
  { label: "Стендап", href: "/events/standup" },
  { label: "Детям", href: "/events/kids" },
]

const SERVICE_LINKS = [
  { label: "Мой профиль", href: "/profile" },
  { label: "Мои билеты", href: "/tickets" },
  { label: "Вернуть билет", href: "/return-order" },
  { label: "Частые вопросы", href: "/faq" },
  { label: "Служба поддержки", href: "/tech-support" },
]

const BRAND_LINKS = [
  { label: "Политика конфиденциальности", href: "/" },
  { label: "Пользовательское соглашение", href: "/" },
  { label: "Условия возврата билетов", href: "/" },
  { label: "Инструкция для организаторов", href: "/" },
]

export function FooterComp() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 w-full border-t border-border/60 bg-card/30 dark:bg-card/10 backdrop-blur-md">
      <div className="w-[90%] max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="w-fit shrink-0">
              <Image
                width={180}
                height={68}
                src="/static/icons/AnubisLogotype.svg"
                alt="Anubis"
                className="opacity-90 dark:brightness-200"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Anubis — премиальный сервис по продаже билетов на культурные и развлекательные события в вашем городе. Простой и быстрый выбор без лишнего шума.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground mt-2">
              <span className="inline-flex items-center gap-2.5">
                <MapPinIcon className="size-4 shrink-0 text-primary" />
                Россия, Москва & Санкт-Петербург
              </span>
              <span className="inline-flex items-center gap-2.5">
                <MailIcon className="size-4 shrink-0 text-primary" />
                support@anubis.ru
              </span>
              <span className="inline-flex items-center gap-2.5">
                <PhoneIcon className="size-4 shrink-0 text-primary" />
                +7 (800) 555-35-35
              </span>
            </div>
          </div>

          {/* Categories column */}
          <div>
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-foreground opacity-80">
              Категории
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              {CATEGORY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service column */}
          <div>
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-foreground opacity-80">
              Сервис
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              {SERVICE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal / Brand column */}
          <div>
            <h4 className="text-sm font-heading font-bold uppercase tracking-wider mb-5 text-foreground opacity-80">
              Информация
            </h4>
            <nav className="flex flex-col gap-3 text-sm">
              {BRAND_LINKS.map((l, index) => (
                <Link
                  key={index}
                  href={l.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border/55 pt-6 gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Anubis. Все права защищены.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
              Разработано в соответствии с <span className="text-primary font-medium">Design System 2.0</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
