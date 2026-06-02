import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-linear-to-b from-white via-white to-[#FF5100]/5">
            <header className="px-4 py-6 sm:px-8">
                <Link
                    href="/"
                    className="text-sm opacity-70 hover:text-[#FF5100] transition-colors"
                >
                    ← На главную
                </Link>
            </header>
            {children}
        </div>
    )
}
