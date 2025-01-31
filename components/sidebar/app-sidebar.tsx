'use client';

import { useEffect, useState } from 'react';

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

// TODO :
// lihat security role base, apakah component masih diloat di client apa enggak (Check user dan role yg kita pakai saat ini adalah type client, cari yg server)
// Perbaiki logo svgk kita yg rusak
// Check apakah ga bisa dapat info dari data yg di pakai di server rendering, karna liat data dari navUser dan nav admin dan nav owner kita yg flicker

import { Role, User } from '@/types/auth';
import { NavOwner } from './nav-owner';
import { createClient } from '@/utils/supabase/client';
import { tableUserProfileName } from '@/utils/constants';

export function AppSidebar({
  hiddenUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & { hiddenUser?: boolean }) {
  const [role, setRole] = useState<Role>('USER');
  const [user, setUser] = useState<
    Pick<User, 'userName' | 'email' | 'avatarUrl'>
  >({
    userName: '',
    email: '',
    avatarUrl: '',
  });

  useEffect(() => {
    async function getUser() {
      const supabase = await createClient();
      const { error: errorGetUser, data: dataUser } =
        await supabase.auth.getUser();

      if (errorGetUser || !dataUser?.user) {
        console.log("User doesn't exists");
        return;
      }

      const { error, data } = await supabase
        .from(tableUserProfileName)
        .select('*')
        .eq('email', dataUser.user?.email)
        .limit(1)
        .single();

      if (error || !data) {
        console.log("User Profiles doesn't exists");
        return;
      }

      const { avatarUrl, userName, email } = data;
      setUser({ avatarUrl, email, userName });
    }
    getUser();
  }, []);

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
          <NavUser
            user={{
              name: user.userName ?? '',
              email: user.email,
              avatar: user.avatarUrl ?? '',
            }}
          />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
