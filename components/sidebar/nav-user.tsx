'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useEffect, useTransition } from 'react';
import { signOut } from '@/actions/auth';
import { createClient } from '@/utils/supabase/client';
import constants from '@/utils/constants';
import { useUserStore } from '@/stores/useUserStore';
import { User } from '@/types/auth';
import Image from 'next/image';

export function NavUser({ initialData }: { initialData: User }) {
  const [isPending, startTransition] = useTransition();

  const { user, setUser } = useUserStore();
  const { isMobile } = useSidebar();
  const fallback = (
    user.userName?.[0] ?? initialData.userName[0]
  )?.toUpperCase();
  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      await signOut();
    });
  };

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
        .from(constants('TABLE_USER_PROFILE_NAME'))
        .select('*')
        .eq('email', dataUser.user?.email)
        .limit(1)
        .single();

      if (error || !data) {
        console.log("User Profiles doesn't exists");
        return;
      }

      setUser(data);
    }
    getUser();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {!!user.avatarUrl || !!initialData.avatarUrl ? (
                <Image
                  width={32}
                  height={32}
                  priority
                  className="size-8 rounded-full object-cover object-center"
                  src={
                    !!user.avatarUrl ? user.avatarUrl : '/profile-default.jpg'
                  }
                  alt={user.userName ?? initialData.userName ?? 'Profile'}
                />
              ) : (
                <div className="size-8 flex justify-center items-center">
                  <span>{fallback}</span>
                </div>
              )}

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.userName ?? initialData.userName}
                </span>
                <span className="truncate text-xs">
                  {user.email ?? initialData.email}
                </span>
              </div>
              <ChevronsUpDown className={'ml-auto size-4'} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {!!user.avatarUrl || !!initialData.avatarUrl ? (
                  <Image
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover object-center"
                    src={
                      user.avatarUrl ??
                      initialData.avatarUrl ??
                      '/profile-default.jpg'
                    }
                    alt={user.userName ?? initialData.userName ?? 'Profile'}
                  />
                ) : (
                  <div className="size-8 flex justify-center items-center">
                    <span>{fallback}</span>
                  </div>
                )}

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.userName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
