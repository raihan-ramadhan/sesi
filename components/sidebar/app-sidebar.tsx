'use client';

import { useEffect, useState } from 'react';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartSpline,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
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

// TODO :
// add pop up collapsible icon untuk tryout
// - add loading state in dropdown user
// 6. verification alert for google sigin because the emailVer is null
// in account page add change name, upload profile pic (aws Storage), connect email user with google account,
// 1. add search in dashboard / sideba

import { getUser } from '@/lib/auth/getUserServerAction';
import { getUserRole } from '@/lib/auth/getUserRoleServerAction';
import { Role, User } from '@/types/auth';
import { NavOwner } from './nav-owner';
import { checkIsRoleAllowed } from '@/lib/auth/checkIsRoleAllowed';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<Role>('USER');
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    image: '',
  });

  useEffect(() => {
    const userInfo = async () => {
      const user = await getUser();
      if (user) {
        setUser(user);
      }

      const role = await getUserRole();
      if (role) {
        setRole(role);
      }
    };

    userInfo();
  }, []);

  console.log(role);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain
          items={[
            {
              title: 'Paket',
              url: '/paket',
              icon: SquareTerminal,
              isActive: true,
              items: [
                {
                  title: 'SKB',
                  url: '#',
                },
                {
                  title: 'PPPK',
                  url: '#',
                },
                {
                  title: 'BUMN',
                  url: '#',
                },
                {
                  title: 'UK',
                  url: '#',
                },
              ],
            },
          ]}
        />
        {checkIsRoleAllowed({ userRole: role, roleComponent: 'ADMIN' }) ? (
          <NavAdmin
            list={[
              {
                name: 'Submitted Question',
                url: '#',
                icon: Frame,
              },
              {
                name: 'Sales & Marketing',
                url: '#',
                icon: PieChart,
              },
              {
                name: 'Travel',
                url: '#',
                icon: Map,
              },
            ]}
          />
        ) : null}
        {checkIsRoleAllowed({ userRole: role, roleComponent: 'OWNER' }) ? (
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
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name ?? '',
            email: user.email,
            avatar: user.image ?? '',
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
