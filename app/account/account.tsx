'use client';

import { useEffect, useState, useTransition } from 'react';
import { GENDER_VALUES, Role, User } from '@/types/auth';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImageUp, SaveIcon, UserRound } from 'lucide-react';
import Image from 'next/image';
import { GradientOverlay } from '@/components/gradient-overlay';
import { cn, toProperCase } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateAccountData } from '@/actions/account';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';

export const AccountPage = ({ initialData }: { initialData: User }) => {
  const [role, setRole] = useState<Role>('USER');
  const bannerHeight = 'h-48 ';
  const [user, setUser] = useState<User>(initialData);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Upload file to server or storage
      setUser((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Upload file to server or storage
      setUser((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }));
    }
  };

  function properValue(value: string) {
    const newValue = toProperCase(value.replaceAll('_', ' '));
    return newValue;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbItem>
                  <BreadcrumbPage>Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* FORM */}
        <form
          action={async (formData) => {
            const { status, message, data } = await updateAccountData({
              oldData: initialData,
              formData,
            });

            if (status == 'success' && data) {
              toast({
                title: 'Sukses!',
                description: 'Kamu berhasil mengupdate data akun kamu',
              });

              setUser(data);
            } else if (message) {
              toast({
                variant: 'destructive',
                title: 'Gagal!',
                description:
                  (message as string) || 'terjadi Kesalahan saat mengupdate!',
              });
            }
          }}
        >
          <div className="grid gap-6 mx-auto p-4">
            {/* BANNER Image*/}
            <div
              className={cn(
                'w-full mb-4 bg-secondary relative rounded-md overflow-clip',
                bannerHeight,
              )}
            >
              <Image
                src={'/default-banner-1.webp'}
                alt="Cover"
                fill
                className="object-cover"
              />

              {/* Gradient Overlay  */}
              <GradientOverlay className={'from-transparent opacity-70'} />

              {/* Upload Banner Image Button */}
              <div
                onClick={() => {
                  if (!pending) document.getElementById('bannerUrl')?.click();
                }}
                className={cn(
                  'absolute bottom-2 right-2 flex bg-black bg-opacity-20 p-2 rounded-sm backdrop-blur-sm text-white text-xs justify-center items-center gap-1 hover:bg-opacity-40 cursor-pointer transition-colors duration-200 select-none',
                  pending && 'cursor-progress',
                )}
              >
                <ImageUp className="size-4" />
                Add a banner image
                <input
                  id="bannerUrl"
                  type="file"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div
              className={cn('w-48 mb-4 bg-transparent absolute', bannerHeight)}
            >
              <div className="relative left-0 bottom-0 w-48 h-48">
                <div className="flex items-center absolute left-10 -bottom-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-4">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl ?? ''}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="rounded-full w-24 h-24 bg-secondary flex justify-center items-center shadow-md">
                        <UserRound className="w-12 h-12" />
                      </div>
                    )}

                    {/* Upload Profile Image Button */}
                    <div
                      onClick={() => {
                        if (!pending)
                          document.getElementById('avatarUrl')?.click();
                      }}
                      className={cn(
                        'flex bg-black bg-opacity-40 p-2 rounded-sm backdrop-blur-sm text-white text-xs justify-center items-center gap-1 hover:bg-opacity-60 cursor-pointer transition-colors duration-200 select-none shadow-md',
                        pending && 'cursor-progress',
                      )}
                    >
                      <ImageUp className="size-4" />
                      Ubah
                      <input
                        id="avatarUrl"
                        disabled={pending}
                        type="file"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="grid gap-2 mt-12">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                name="username"
                maxLength={320}
                placeholder="Nama"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
                type="text"
                defaultValue={user.username ?? ''}
                disabled={pending}
                required
              />
            </div>

            {/* Email  */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm  md:text-sm items-center">
                <p className="cursor-default">{user.email}</p>
              </div>
            </div>

            {/* Gender Select*/}
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select defaultValue={user.gender ?? ''} name="gender">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jenis Kelamin</SelectLabel>
                    <SelectItem value={GENDER_VALUES['0']}>
                      {properValue(GENDER_VALUES['0'])}
                    </SelectItem>
                    <SelectItem value={GENDER_VALUES['1']}>
                      {properValue(GENDER_VALUES['1'])}
                    </SelectItem>
                    <SelectItem value={GENDER_VALUES['2']}>
                      {properValue(GENDER_VALUES['2'])}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Address Input */}
            <div className="grid gap-2">
              <Label htmlFor="address">Domisili</Label>
              <Input
                id="address"
                name="address"
                maxLength={320}
                placeholder="Domisili"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, address: e.target.value }))
                }
                type="text"
                value={user.address ?? ''}
                disabled={pending}
              />
            </div>

            {/* Phone Number Input */}
            {/* <div className="grid gap-2">
              <Label htmlFor="phoneNumber">No telp</Label>
              <Input
                id="phoneNumber"
                maxLength={320}
                placeholder="08- Atau 628-"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                type="text"
                value={user.phoneNumber ?? ''}
                disabled={isPending}
                required
              />
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-1"
            >
              <SaveIcon className="size-5" />
              Simpan
            </button>
          </div>
        </form>
      </SidebarInset>
    </SidebarProvider>
  );
};
