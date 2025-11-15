import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { DashboardAuthCheck } from '@/components/layout/dashboard-auth-check';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthCheck>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden w-full min-w-0">
          <Header />
          <main className="flex-1 overflow-auto w-full min-w-0">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </DashboardAuthCheck>
  );
}
