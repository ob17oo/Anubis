import Image from "next/image"
import Link from "next/link"

interface AuthCardProps {
    title: string
    subtitle?: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="rounded-[28px] border border-[#FF5100]/18 bg-white/80 p-6 sm:p-10 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.45)]">
                    <Link href="/" className="flex justify-center mb-8">
                        <Image
                            width={200}
                            height={80}
                            src="/static/icons/AnubisLogotype.svg"
                            alt="Anubis"
                        />
                    </Link>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
                        {subtitle && (
                            <p className="mt-2 text-sm opacity-70">{subtitle}</p>
                        )}
                    </div>
                    {children}
                    {footer && <div className="mt-6">{footer}</div>}
                </div>
            </div>
        </div>
    )
}
