import { getAccountData } from '@/actions/account';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, message } = await getAccountData();
  if (!data) {
    console.error({ error: message });
    redirect('/sign-in');
  }
  return (
    <SidebarProvider>
      <AppSidebar initialData={data} />
      {children}
    </SidebarProvider>
  );
}
