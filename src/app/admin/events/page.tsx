import { prisma } from "@/shared/lib/prisma";
import { ModerationButtons } from "@/features/admin/ui/ModerationButtons";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Calendar, Tag, MapPin, Search } from "lucide-react";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" }
  });

  async function deleteEvent(formData: FormData) {
    "use server"
    const id = formData.get("eventId") as string;
    await prisma.event.delete({
      where: { id }
    });
    revalidatePath("/admin/events");
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-black mb-2 tracking-tight">События платформы</h1>
          <p className="text-muted-foreground text-lg">Управление и модерация всех мероприятий</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-border/50">
        <div className="p-6 border-b border-border/50 bg-secondary/30 flex items-center gap-4">
           <div className="bg-surface border border-border/50 rounded-2xl flex items-center px-4 py-3 flex-1 max-w-md focus-within:ring-2 focus-within:ring-primary/50 transition-all">
             <Search className="w-5 h-5 text-muted-foreground mr-3" />
             <input type="text" placeholder="Поиск мероприятий..." className="bg-transparent border-none outline-none w-full placeholder:text-muted-foreground" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/10">
                <th className="px-6 py-5 font-semibold text-muted-foreground">Мероприятие</th>
                <th className="px-6 py-5 font-semibold text-muted-foreground">Статус</th>
                <th className="px-6 py-5 font-semibold text-muted-foreground">Детали</th>
                <th className="px-6 py-5 font-semibold text-muted-foreground text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-border/50 hover:bg-secondary/20 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="capitalize">{event.genre}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 text-xs font-bold tracking-wide uppercase rounded-full shadow-sm ${
                      event.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 
                      event.status === 'MODERATING' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                      'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[150px]">{event.location || "Место не указано"}</span>
                      </div>
                      <div className="font-semibold text-primary mt-1">
                        {event.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end items-center gap-4">
                      <ModerationButtons eventId={event.id} status={event.status} />
                      <form action={deleteEvent}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button type="submit" className="text-sm font-medium text-destructive/80 hover:text-destructive transition-colors px-3 py-2 rounded-xl hover:bg-destructive/10">
                          Удалить
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="w-10 h-10 text-muted-foreground opacity-50" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Нет мероприятий</h3>
                      <p className="text-muted-foreground max-w-sm">Здесь будут отображаться все созданные события для модерации.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
