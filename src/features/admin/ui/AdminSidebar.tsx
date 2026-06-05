"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, LogOut, RotateCcw, CreditCard } from "lucide-react";

export function AdminSidebar({ className = "hidden md:flex sticky top-0" }: { className?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Сводка", path: "/admin", icon: LayoutDashboard },
    { name: "События", path: "/admin/events", icon: Calendar },
    { name: "Пользователи", path: "/admin/users", icon: Users },
    { name: "Возвраты", path: "/admin/refunds", icon: RotateCcw },
    { name: "Платежи", path: "/admin/payments", icon: CreditCard },
  ];

  return (
    <aside className={`w-72 glass-panel border-r border-border/50 flex flex-col h-screen shadow-2xl z-20 ${className}`}>
      <div className="p-8 border-b border-border/50">
        <Link href="/admin" className="text-3xl font-heading font-black text-gradient tracking-tight">
          Anubis Admin
        </Link>
      </div>
      <nav className="flex-1 p-6 space-y-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-medium text-base ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80 hover:translate-x-1"
              }`}
            >
              <item.icon size={22} className={isActive ? "text-primary-foreground" : "opacity-70"} />
              {item.name}
            </Link>
          );
        })}
        
        <div className="pt-6 mt-6 border-t border-border/50">
          <Link href="/organizer" className="flex items-center gap-4 px-5 py-4 text-accent hover:text-accent-foreground hover:bg-accent/10 rounded-2xl transition-all font-semibold hover:translate-x-1">
            <LayoutDashboard size={22} className="text-accent" />
            Кабинет организатора
          </Link>
        </div>
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
