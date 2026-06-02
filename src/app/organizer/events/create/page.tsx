import { getServerSession } from "next-auth"
import { authOption } from "@/shared/lib/auth"
import { CreateEventForm } from "@/features/admin/ui/CreateEventForm"

export default async function CreateEventPage() {
    const session = await getServerSession(authOption)
    if (!session?.user?.id) return null

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-2">Создать новое мероприятие</h1>
                <p className="text-muted-foreground">Заполните детали события. Изображение будет загружено в облако, а после модерации событие станет доступно пользователям.</p>
            </div>

            <CreateEventForm />
        </div>
    )
}
