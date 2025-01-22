'use client';

import { getUser } from '@/lib/auth/getUserServerAction';
import { getUserRole } from '@/lib/auth/getUserRoleServerAction';
// import { getAccountLinkStatus } from '@/lib/auth/getAccountLinkStatusServerAction';
// import { handleGoogleSignIn } from '@/lib/auth/googleSignInServerAction';
// import { unlinkGoogleAccount } from '@/lib/auth/unlinkGoogleAccountServerAction';
import { useEffect, useState, useTransition } from 'react';
import { Role, User } from '@/types/auth';
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
import { ImageUp, SaveIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { GradientOverlay } from '@/components/gradient-overlay';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// update user
// use initial data from server component for get role, so the nav-admin-owner not got flicker, and the user intial in nav-user and account page not got flicker
// verification email / gmail,
// - verification alert for google sigin because the emailVer is null OR  connect email user with google account,

export const AccountPage: React.FC = () => {
  const [role, setRole] = useState<Role>('USER');
  const [isPending, startTransition] = useTransition();
  const bannerHeight = 'h-48 ';
  const [user, setUser] = useState<
    User & {
      banner: string;
      phoneNumber: string;
      gender?: 'WANITA' | 'PRIA' | 'MEMILIH_TIDAK_UNTUK_DIKATAKAN' | null;
      address: string;
    }
  >({
    name: '',
    email: '',
    image: '',
    banner: '',
    phoneNumber: '',
    gender: null,
    address: '',
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page, allowing us to handle the submission in TypeScript.
    try {
      startTransition(async () => {
        // await handleEmailSignIn(formData.email);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar hiddenUser={true} />
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mx-auto p-4">
            {/* BANNER Image*/}
            <div
              className={cn(
                'w-full mb-4 bg-secondary relative rounded-md overflow-clip',
                bannerHeight,
              )}
            >
              <Image
                src={user.banner ?? '/default-banner-1.webp'}
                alt="Cover"
                fill
                className="object-cover"
              />

              {/* Gradient Overlay  */}
              <GradientOverlay className={'from-transparent opacity-70'} />

              {/* Upload Banner Image Button */}
              <div
                onClick={() => document.getElementById('banner')?.click()}
                className="absolute bottom-2 right-2 flex bg-black bg-opacity-20 p-2 rounded-sm backdrop-blur-sm text-white text-xs justify-center items-center gap-1 hover:bg-opacity-40 cursor-pointer transition-colors duration-200 select-none"
              >
                <ImageUp className="size-4" />
                Add a banner image
                <input
                  id="banner"
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
                  <div className="flex items-center gap-4 ">
                    <img
                      src={user.image ?? ''}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />

                    {/* Upload Profile Image Button */}
                    <div
                      onClick={() => document.getElementById('image')?.click()}
                      className="flex bg-black bg-opacity-40 p-2 rounded-sm backdrop-blur-sm text-white text-xs justify-center items-center gap-1 hover:bg-opacity-60 cursor-pointer transition-colors duration-200 select-none"
                    >
                      <ImageUp className="size-4" />
                      Ubah
                      <input
                        id="image"
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                maxLength={320}
                placeholder="Nama"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, name: e.target.value }))
                }
                type="text"
                value={user.name ?? ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                maxLength={320}
                placeholder="Email"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
                }
                type="text"
                value={user.email ?? ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Gender Select*/}
            <div className="grid gap-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select>
                <SelectTrigger className="w-[320px]">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jenis Kelamin</SelectLabel>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                    <SelectItem value="none-spcecify">
                      Tidak Ingin Menyebutkan
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
                maxLength={320}
                placeholder="Domisili"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, domisili: e.target.value }))
                }
                type="text"
                value={user.address ?? ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">No telp</Label>
              <Input
                id="phoneNumber"
                maxLength={320}
                placeholder="08- Atau 628-"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, phoneNumber: e.target.value }))
                }
                type="text"
                value={user.phone ?? ''}
                disabled={isPending}
                required
              />
            </div>

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
