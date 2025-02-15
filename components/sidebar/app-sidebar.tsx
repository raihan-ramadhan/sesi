'use client';

import {
  BookOpenText,
  ChartSpline,
  Frame,
  LayoutDashboard,
  PencilRuler,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavAdmin } from '@/components/sidebar/nav-admin';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

import { User } from '@/types/auth';

export function AppSidebar({
  initialData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  initialData: User;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: 'Dashboard',
              url: '/dashboard',
              icon: LayoutDashboard,
            },
            {
              title: 'Tryout',
              url: '/tryout',
              icon: BookOpenText,
            },
            {
              title: 'Paket',
              url: '/paket',
              icon: SquareTerminal,
              isActive: true,
              items: [
                {
                  title: 'SKB',
                  url: '/coming-soon?from=SKB',
                },
                {
                  title: 'PPPK',
                  url: '/coming-soon?from=PPPK',
                },
                {
                  title: 'BUMN',
                  url: '/coming-soon?from=BUMN',
                },
                {
                  title: 'UK',
                  url: '/coming-soon?from=UK',
                },
              ],
            },
            {
              title: 'Pembelajaran Saya',
              url: '/coming-soon?from=my-learning',
              icon: PencilRuler,
            },
          ]}
        />
        {/* HERE WE WILL CHECK IF THE ROLE IS ADMIN OR NOT */}
        {true ? (
          <NavAdmin
            list={[
              {
                name: 'Submitted Questions',
                url: '/submitted-questions',
                icon: Frame,
              },
              {
                name: 'Analytics',
                url: '/analytics',
                icon: ChartSpline,
              },
            ]}
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <NavUser initialData={initialData} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
