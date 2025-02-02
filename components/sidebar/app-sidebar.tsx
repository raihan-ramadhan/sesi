'use client';

import {
  BookOpenText,
  ChartSpline,
  Frame,
  LayoutDashboard,
  Map,
  PencilRuler,
  PieChart,
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

import { NavOwner } from './nav-owner';
import { User } from '@/types/auth';

export function AppSidebar({
  hiddenUser,
  initialData,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  hiddenUser?: boolean;
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
              url: '/coming-soon?from=tryout',
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
        {true ? (
          <NavAdmin
            list={[
              {
                name: 'Submitted Question',
                url: '/coming-soon?from=Submitted-Question',
                icon: Frame,
              },
              {
                name: 'Sales & Marketing',
                url: '/coming-soon?from=Sales',
                icon: PieChart,
              },
              {
                name: 'Travel',
                url: '/coming-soon?from=Travel',
                icon: Map,
              },
            ]}
          />
        ) : null}
        {true ? (
          <NavOwner
            projects={[
              {
                name: 'Analytics',
                url: '/analytics',
                icon: ChartSpline,
              },
            ]}
          />
        ) : null}
      </SidebarContent>
      {hiddenUser ? null : (
        <SidebarFooter>
          <NavUser initialData={initialData} />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
