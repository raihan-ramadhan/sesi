'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { User } from '@/types/auth';
import {
  avatarsStorageName,
  storageName,
  tableUserProfileName,
} from '@/utils/constants';
import { createClient } from '@/utils/supabase/client';
import { randomBytes } from 'crypto';
import { ImageUp, LoaderCircle, Save, UserRound } from 'lucide-react';
import Error from 'next/error';
import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useTransition,
} from 'react';

export default function UploadAvatar({
  bannerHeight,
  user,
  setUser,
  initialData,
}: {
  bannerHeight: string;
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  initialData: User;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setUser((prev) => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
    }
  };

  const uploadFile = () => {
    startTransition(async () => {
      try {
        if (!file)
          throw new Error({
            statusCode: 400,
            title: 'Pilih file nya terlebih dahulu',
          });

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error({
            statusCode: 400,
            title: 'Only JPEG, PNG, and WebP formats are allowed.',
          });
        }

        if (file.size > MAX_SIZE) {
          throw new Error({
            statusCode: 400,
            title: 'File size must be less than 5MB.',
          });
        }

        const supabase = await createClient();
        const isAuthenticated = await supabase.auth.getUser();
        if (!isAuthenticated.data.user)
          throw new Error({
            statusCode: 400,
            title: 'Silahkan login terlebih dahulu',
          });

        const fileExt = file.name.split('.').pop();
        const fileName = `${randomBytes(16).toString('hex')}.${fileExt}`;
        const filePath = `${fileName}`;

        // UPLOAD IMAGE
        const { error: errorUpload } = await supabase.storage
          .from(avatarsStorageName)
          .upload(filePath, file);

        if (errorUpload)
          throw new Error({
            statusCode: 400,
            title: errorUpload.message,
          });

        // GET URL
        const { data } = await supabase.storage
          .from(avatarsStorageName)
          .getPublicUrl(filePath);

        // UPDATE TABLE
        const { error: updateError } = await supabase
          .from(tableUserProfileName)
          .update({ avatarUrl: data.publicUrl })
          .eq('email', isAuthenticated.data.user.email)
          .select()
          .single();

        if (updateError)
          throw new Error({
            statusCode: 400,
            title: updateError.message,
          });

        // REMOVE THE OLD IMAGE IF THE IMAGE FROM SUPABASE
        if (initialData.avatarUrl.includes('supabase.co')) {
          const array = initialData.avatarUrl.split('/');
          const pathName = `${array[array.length - 2]}/${array[array.length - 1]}`;
          await supabase.storage
            .from(storageName)
            .remove([pathName])
            .catch((error: any) => {
              console.log({ error });
            });
        }

        toast({
          title: 'Berhasil!',
          description: 'Foto profil berhasil di update!',
        });
        setUser((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
        setFile(undefined);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Gagal!',
          description:
            error?.props?.title ??
            error?.message ??
            'Terjadi kesalahan saat mengupload',
        });
        setUser((prev) => ({ ...prev, avatarUrl: initialData.avatarUrl }));
        setFile(undefined);
      }
    });
  };

  return (
    <div className={cn('w-48 mb-4 bg-transparent absolute', bannerHeight)}>
      <div className="relative left-0 bottom-0 w-48 h-48">
        <div className="flex items-center absolute left-10 -bottom-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4">
            {!!user.avatarUrl ? (
              <div className="w-24 h-24 relative shadow-md rounded-full overflow-hidden">
                <Image
                  src={user.avatarUrl ?? ''}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="rounded-full w-24 h-24 bg-secondary flex justify-center items-center shadow-md">
                <UserRound className="w-12 h-12" />
              </div>
            )}

            {/* Upload Profile Image Button */}
            {!!file ? (
              <Button
                size={'sm'}
                type="button"
                variant={'default'}
                onClick={uploadFile}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save />
                    Save
                  </>
                )}
              </Button>
            ) : (
              <Button
                size={'sm'}
                onClick={() => {
                  if (!isPending && fileInputRef.current)
                    fileInputRef.current.click();
                }}
                type="button"
                className={cn(
                  'flex bg-black bg-opacity-40 hover:bg-opacity-60 hover:bg-black',
                  isPending && 'cursor-progress',
                )}
              >
                <ImageUp className="size-4" />
                Ubah
                <input
                  type="file"
                  id="avatarUrl"
                  className="hidden"
                  ref={fileInputRef}
                  disabled={isPending}
                  onChange={handleProfilePicChange}
                  accept="image/jpeg, image/png, image/webp"
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
