import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "@/shared/lib/auth";
import { AdminSidebar } from "@/features/admin/ui/AdminSidebar";
import { MobileAdminNav } from "@/features/admin/ui/MobileAdminNav";
import Image from "next/image";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOption);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        
        <header className="h-20 glass-panel border-b border-border/50 flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 md:gap-4">
            <MobileAdminNav />
            <h2 className="text-xl md:text-2xl font-heading font-bold tracking-tight truncate max-w-[150px] md:max-w-none">Панель администратора</h2>
          </div>
          <div className="flex items-center gap-4 bg-secondary/30 px-4 py-2 rounded-full border border-border/50 shadow-sm backdrop-blur-md">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
              <Image fill className="object-cover" src={session.user.imageUrl || '/static/images/default-avatar.png'} alt="Avatar"/>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">{session.user.userName}</span>
              <span className="text-xs text-primary font-medium leading-tight">{session.user.role}</span>
            </div>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 md:p-10 flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
