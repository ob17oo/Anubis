"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarPlus, LogOut, Shield } from "lucide-react";

interface OrganizerSidebarProps {
  isAdmin: boolean;
  className?: string;
}

export function OrganizerSidebar({ isAdmin, className = "hidden md:flex sticky top-0" }: OrganizerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Сводка", path: "/organizer", icon: LayoutDashboard },
    { name: "Мои мероприятия", path: "/organizer/events", icon: CalendarPlus },
  ];

  return (
    <aside className={`w-72 glass-panel border-r border-border/50 flex flex-col h-screen shadow-2xl z-20 ${className}`}>
      <div className="p-8 border-b border-border/50">
        <Link href="/organizer" className="text-3xl font-heading font-black text-accent tracking-tight">
          Организатор
        </Link>
      </div>
      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          // Simple exact match or startsWith for nested routes (like /organizer/events/create)
          const isReallyActive = item.path === '/organizer' ? pathname === '/organizer' : isActive;
          
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium text-base ${
                isReallyActive 
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20 translate-x-1" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:translate-x-1"
              }`}
            >
              <item.icon size={22} className={isReallyActive ? "text-accent-foreground" : "opacity-70"} />
              {item.name}
            </Link>
          );
        })}
        
        {isAdmin && (
          <div className="pt-6 mt-6 border-t border-border/50">
            <Link href="/admin" className="flex items-center gap-4 px-5 py-4 text-primary hover:text-primary-foreground hover:bg-primary/10 rounded-2xl transition-all font-semibold hover:translate-x-1">
              <Shield size={22} className="text-primary" />
              Панель администратора
            </Link>
          </div>
        )}
      </nav>
      <div className="p-6 border-t border-border/50">
        <Link href="/" className="flex items-center gap-4 px-5 py-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all font-medium">
          <LogOut size={22} className="opacity-70" />
          Вернуться на сайт
        </Link>
      </div>
    </aside>
  );
}
