'use client';

import { useEffect, useState } from 'react';

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavProjects } from '@/components/sidebar/nav-projects';
import { NavUser } from '@/components/sidebar/nav-user';
import { TeamSwitcher } from '@/components/sidebar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
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
  ],
};

// TODO :
// 1. add search in dashboard / sidebar
// 3. add profile page
// 4. add sidebar item
// 5. add admin role nav item
// 6. verification alert for google sigin

import { useSession } from 'next-auth/react';
import { getUser } from '@/lib/auth/getUserServerAction';
import { getUserRole } from '@/lib/auth/getUserRoleServerAction';
import { getAccountLinkStatus } from '@/lib/auth/getAccountLinkStatusServerAction';
import { User } from '@/types/auth';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [role, setRole] = useState('');
  const { update } = useSession();
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

    const accountLinkStatus = async () => {
      try {
        const accountLinkStatus = await getAccountLinkStatus();
        setIsAccountLinked(accountLinkStatus);
      } catch (error) {
        console.error('Failed to get account link status:', error);
      }
    };
    userInfo();
    accountLinkStatus();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
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
