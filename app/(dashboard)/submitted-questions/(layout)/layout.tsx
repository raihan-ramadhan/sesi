import { getAccountData } from '@/actions/account';
import { redirect } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { getPathname } from '@/utils/server-only-utils';
import { toProperCase } from '@/utils/utils';

export default async function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, message } = await getAccountData();

  if (!data) {
    console.error({ error: message });
    redirect('/sign-in');
  }

  const pathname = await getPathname();
  const lastPath = pathname.split('/')[pathname.split('/').length - 1];
  const currPage = toProperCase(lastPath.split('-').join(' '));

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/submitted-questions">
                  Submitted Questions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{currPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="grid gap-6 mx-auto w-full p-[0_16px_16px_16px]">
        {children}
      </div>
    </SidebarInset>
  );
}
