import { prisma } from "@/shared/lib"
import { authOption } from "@/shared/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { BellIcon, PackageIcon, TicketIcon, TagIcon } from "lucide-react"

export const metadata = {
    title: "Уведомления | Anubis",
}

const getIcon = (type: string) => {
    switch (type) {
        case 'ORDER': return <PackageIcon className="size-5 text-primary" />
        case 'EVENT_UPDATE': return <TicketIcon className="size-5 text-accent" />
        case 'PROMO': return <TagIcon className="size-5 text-emerald-500" />
        default: return <BellIcon className="size-5 text-muted-foreground" />
    }
}

export default async function NotificationsPage() {
    const session = await getServerSession(authOption)

    if (!session?.user?.id) {
        redirect('/login?callbackUrl=/profile/notifications')
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <main className="py-10 w-[90%] max-w-[800px] mx-auto animate-in fade-in duration-500">
            <h1 className="text-4xl font-heading font-bold mb-8">Уведомления</h1>

            {notifications.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-3xl flex flex-col items-center justify-center gap-4">
                    <BellIcon className="size-16 text-muted-foreground opacity-50" />
                    <p className="text-xl font-medium">У вас нет новых уведомлений</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`glass-panel p-6 rounded-2xl flex gap-4 ${notification.isRead ? 'opacity-70' : 'border-primary/30'}`}>
                            <div className="mt-1">{getIcon(notification.type)}</div>
                            <div>
                                <h3 className="font-semibold text-lg">{notification.title}</h3>
                                <p className="text-muted-foreground mt-1">{notification.message}</p>
                                <span className="text-xs text-muted-foreground/60 mt-3 block">
                                    {new Date(notification.createdAt).toLocaleDateString('ru-RU', {
                                        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
