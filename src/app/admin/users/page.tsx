import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  USER: 'İstifadəçi',
};

async function getUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">İstifadəçilər</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cəmi: {users.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Ad</th>
                  <th className="py-2">E-poçt</th>
                  <th className="py-2">Rol</th>
                  <th className="py-2">Tarix</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name || '-'}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{ROLE_LABELS[user.role] ?? user.role}</td>
                    <td className="py-2">
                      {new Date(user.createdAt).toLocaleDateString('az-AZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
