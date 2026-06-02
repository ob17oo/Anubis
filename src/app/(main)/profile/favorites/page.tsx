import { getServerSession } from "next-auth";
import { authOption } from "@/shared/lib/auth";
import { getUserFavorites } from "@/entities/favorite/api/favorite.api";
import { EventsGrid } from "@/widgets/EventsView/ui";
import { redirect } from "next/navigation";
import { TEvent } from "@/entities/event/model";
import Link from "next/link";

export default async function FavoritesPage() {
    const session = await getServerSession(authOption);

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const favorites = await getUserFavorites(session.user.id);
    const events = favorites.map(f => ({
        ...f.event,
        location: f.event.location || ""
    })) as unknown as TEvent[];

    return (
        <div className="w-[90%] max-w-[1400px] mx-auto py-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-bold font-sans">Избранное</h1>
                <p className="text-muted-foreground text-lg">
                    Сохраненные вами мероприятия
                </p>
            </div>

            {events.length === 0 ? (
                <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 mt-8">
                    <p className="text-2xl font-bold">Вы пока ничего не добавили</p>
                    <p className="text-muted-foreground max-w-md">
                        Нажимайте на сердечко в карточках мероприятий, чтобы сохранить их здесь и не потерять.
                    </p>
                    <Link href="/" className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                        В афишу
                    </Link>
                </div>
            ) : (
                <EventsGrid events={events} />
            )}
        </div>
    );
}
