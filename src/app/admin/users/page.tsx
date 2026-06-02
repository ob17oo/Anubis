import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { userName: "asc" }
  });

  async function makeAdmin(formData: FormData) {
    "use server"
    const id = formData.get("userId") as string;
    await prisma.user.update({
      where: { id },
      data: { role: 'ADMIN' }
    });
    revalidatePath("/admin/users");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold">Пользователи</h1>

      <div className="glass-panel rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="p-4 font-medium text-muted-foreground">Имя пользователя</th>
              <th className="p-4 font-medium text-muted-foreground">Email</th>
              <th className="p-4 font-medium text-muted-foreground">Роль</th>
              <th className="p-4 font-medium text-muted-foreground text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                <td className="p-4 font-medium">{user.userName}</td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'ADMIN' ? 'bg-accent/20 text-accent' : 'bg-secondary text-secondary-foreground'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {user.role !== 'ADMIN' && (
                    <form action={makeAdmin} className="inline">
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="text-sm text-primary hover:underline">
                            Назначить админом
                        </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Пользователи не найдены.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
