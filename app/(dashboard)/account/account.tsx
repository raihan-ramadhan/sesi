'use client';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import UploadAvatar from '@/components/account/UploadAvatar';
import UploadBanner from '@/components/account/UploadBanner';
import { GENDER_VALUES, User } from '@/types/auth';
import { updateAccountData } from '@/actions/account';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/stores/useUserStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEffect, useTransition } from 'react';
import { toProperCase } from '@/utils/utils';
import { useFormStatus } from 'react-dom';
import { LoaderCircle, SaveIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import constants from '@/utils/constants';
import useToastResult from '@/hooks/use-toast-result';

export const AccountPage = ({ initialData }: { initialData: User }) => {
  const [isPending, startTransition] = useTransition();

  const { user, setUser } = useUserStore();
  const bannerHeight = 'h-48 ';
  const { pending } = useFormStatus();
  const { toastResHandler } = useToastResult();
  function properValue(value: string) {
    const newValue = toProperCase(value.replaceAll('_', ' '));
    return newValue;
  }

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const { status, message, data } = await updateAccountData({
          oldData: initialData,
          formData,
        });

        if (status == constants('STATUS_SUCCESS') && data) {
          // SUCCESS HANDLING
          toastResHandler({
            status: constants('STATUS_SUCCESS'),
            successMessage: 'Kamu berhasil mengupdate data akun kamu',
          });

          setUser(data);
        } else if (message) {
          // SERVER ERROR HANDLING
          toastResHandler({ status: 'error', error: message });
        }
      } catch (error: unknown) {
        // CLIENT ERROR HANDLING
        toastResHandler({ status: 'error', error: error });
      }
    });
  };

  useEffect(() => {
    return () => {
      setUser(initialData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* FORM */}
      <form action={formAction}>
        <div className="grid gap-6 mx-auto p-[0_16px_16px_16px]">
          {/* BANNER Image*/}
          <UploadBanner bannerHeight={bannerHeight} initialData={initialData} />

          {/* Profile Picture */}
          <UploadAvatar bannerHeight={bannerHeight} initialData={initialData} />

          {/* Name Input */}
          <div className="grid gap-2 mt-12">
            <Label htmlFor="userName">Name</Label>
            <Input
              id="userName"
              name="userName"
              maxLength={320}
              placeholder="Nama"
              onChange={(e) => setUser({ userName: e.target.value })}
              type="text"
              defaultValue={user.userName ?? initialData.userName}
              disabled={pending}
            />
          </div>

          {/* Email  */}
          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm  md:text-sm items-center">
              <p className="cursor-default">
                {user.email ?? initialData.email}
              </p>
            </div>
          </div>

          {/* Gender Select*/}
          <div className="grid gap-2">
            <Label htmlFor="gender">Jenis Kelamin</Label>
            <Select
              defaultValue={user.gender ?? initialData.gender}
              name="gender"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel defaultValue={''}>Jenis Kelamin</SelectLabel>
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
              onChange={(e) => setUser({ address: e.target.value })}
              type="text"
              value={user.address ?? initialData.address}
              disabled={pending}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-1"
          >
            {isPending ? (
              <>
                <LoaderCircle className="size-5 animate-spin" />
                Menyimpan
              </>
            ) : (
              <>
                <SaveIcon className="size-5" /> Simpan
              </>
            )}
          </button>
        </div>
      </form>
    </SidebarInset>
  );
};
