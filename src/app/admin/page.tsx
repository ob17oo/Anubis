import { Users, Calendar, Ticket, Coins } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count();
  const eventsCount = await prisma.event.count();
  const ticketsCount = await prisma.ticket.count();

  const totalRevenueResult = await prisma.ticket.aggregate({
    where: {
      status: 'CONFIRMED'
    },
    _sum: {
      totalPrice: true
    }
  });
  const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-4xl font-heading font-black mb-2 tracking-tight">Сводка платформы</h1>
        <p className="text-muted-foreground text-lg">Обзор ключевых показателей Anubis</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border border-primary/20">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Всего пользователей</h3>
            <div className="bg-primary/20 p-3 rounded-2xl">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-5xl font-black font-heading z-10">{usersCount.toLocaleString('ru-RU')}</div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors"></div>
        </div>
        
        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border border-accent/20">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Всего мероприятий</h3>
            <div className="bg-accent/20 p-3 rounded-2xl">
              <Calendar className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="text-5xl font-black font-heading z-10">{eventsCount.toLocaleString('ru-RU')}</div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-colors"></div>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border border-emerald-500/20">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Продано билетов</h3>
            <div className="bg-emerald-500/20 p-3 rounded-2xl">
              <Ticket className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <div className="text-5xl font-black font-heading z-10">{ticketsCount.toLocaleString('ru-RU')}</div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-colors"></div>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform border border-indigo-500/20">
          <div className="flex items-center justify-between z-10">
            <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Общая выручка</h3>
            <div className="bg-indigo-500/20 p-3 rounded-2xl">
              <Coins className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
          <div className="text-4xl font-black font-heading z-10">{totalRevenue.toLocaleString('ru-RU')} ₽</div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
        </div>
      </div>
    </div>
  );
}
