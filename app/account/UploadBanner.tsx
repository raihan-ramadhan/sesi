'use client';

import { GradientOverlay } from '@/components/gradient-overlay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { User } from '@/types/auth';
import {
  bannersStorageName,
  storageName,
  tableUserProfileName,
} from '@/utils/constants';
import { createClient } from '@/utils/supabase/client';
import { randomBytes } from 'crypto';
import { ImageUp, LoaderCircle, Save, Trash, UserRound } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Error from 'next/error';
import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useTransition,
} from 'react';

export default function UploadBanner({
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
  const [isLoading, setIsLoading] = useState(true);
  const imgSrc: string | StaticImport = !!user.bannerUrl
    ? user.bannerUrl
    : '/default-banner-1.webp';

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setUser((prev) => ({ ...prev, bannerUrl: URL.createObjectURL(file) }));
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
            statusCode: 415,
            title: 'Only JPEG, PNG, and WebP formats are allowed.',
          });
        }

        if (file.size > MAX_SIZE) {
          throw new Error({
            statusCode: 413,
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
          .from(bannersStorageName)
          .upload(filePath, file);

        if (errorUpload)
          throw new Error({
            statusCode: 400,
            title: errorUpload.message,
          });

        // GET URL
        const { data } = await supabase.storage
          .from(bannersStorageName)
          .getPublicUrl(filePath);

        // UPDATE TABLE
        const { error: updateError } = await supabase
          .from(tableUserProfileName)
          .update({ bannerUrl: data.publicUrl })
          .eq('email', isAuthenticated.data.user.email)
          .select()
          .single();

        if (updateError)
          throw new Error({
            statusCode: 400,
            title: updateError.message,
          });

        // REMOVE THE OLD IMAGE IF THE IMAGE FROM SUPABASE
        if (initialData.bannerUrl.includes('supabase.co')) {
          const array = initialData.bannerUrl.split('/');
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
        setUser((prev) => ({ ...prev, bannerUrl: data.publicUrl }));
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
        setUser((prev) => ({ ...prev, bannerUrl: initialData.bannerUrl }));
        setFile(undefined);
      }
    });
  };

  const deleteBanner = () => {
    startTransition(async () => {
      try {
        const supabase = await createClient();
        const isAuthenticated = await supabase.auth.getUser();
        if (!isAuthenticated.data.user)
          throw new Error({
            statusCode: 400,
            title: 'Silahkan login terlebih dahulu',
          });

        const { error: updateError } = await supabase
          .from(tableUserProfileName)
          .update({ bannerUrl: '' })
          .eq('email', isAuthenticated.data.user.email)
          .select()
          .single();

        if (updateError)
          throw new Error({
            statusCode: 400,
            title: updateError.message,
          });

        const array = user.bannerUrl.split('/');
        const pathName = `${array[array.length - 2]}/${array[array.length - 1]}`;
        const { error: deleteImageError } = await supabase.storage
          .from(storageName)
          .remove([pathName]);

        if (deleteImageError)
          throw new Error({
            statusCode: 400,
            title: deleteImageError.message,
          });

        toast({
          title: 'Berhasil!',
          description: 'Gambar banner berhasil di hapus!',
        });
        setUser((prev) => ({ ...prev, bannerUrl: '' }));
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Gagal!',
          description:
            error?.props?.title ??
            error?.message ??
            'Terjadi kesalahan saat mengupload',
        });
      }
    });
  };

  return (
    <div
      className={cn(
        'w-full mb-4 bg-secondary relative rounded-md overflow-clip',
        bannerHeight,
      )}
    >
      <Image
        src={imgSrc}
        alt="Cover"
        fill
        className="object-cover"
        onLoad={() => setIsLoading(false)}
      />
      {isLoading ? (
        <div className="absolute inset-0 size-full bg-muted" />
      ) : (
        <>
          {/* Gradient Overlay  */}
          <GradientOverlay className={'from-transparent opacity-70'} />

          {/* Upload Banner Image Button */}
          {!!file ? (
            <div className="absolute bottom-2 right-2 flex justify-center items-center gap-1">
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
              <Button
                onClick={() => {
                  setUser((prev) => ({
                    ...prev,
                    bannerUrl: initialData.bannerUrl,
                  }));
                  setFile(undefined);
                }}
                size={'sm'}
                type="button"
                variant={'destructive'}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-1 absolute bottom-2 right-2 ">
              <Button
                type="button"
                size={'sm'}
                onClick={() => {
                  if (!isPending && fileInputRef.current)
                    fileInputRef.current.click();
                }}
                className={cn(
                  'flex bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-40  hover:bg-black',
                  isPending && 'cursor-progress',
                )}
              >
                <ImageUp className="size-4" />
                {!!user.bannerUrl ? 'Ubah' : 'Tambah'} gambar banner
                <input
                  ref={fileInputRef}
                  id="bannerUrl"
                  disabled={isPending}
                  type="file"
                  onChange={handleProfilePicChange}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
              </Button>
              {!!user.bannerUrl ? (
                <Button
                  type="button"
                  size={'sm'}
                  onClick={deleteBanner}
                  variant={'destructive'}
                  className={cn(
                    'bg-black bg-opacity-20 backdrop-blur-sm hover:bg-opacity-40  hover:bg-destructive',
                    isPending && 'cursor-progress',
                  )}
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Trash />
                  )}
                </Button>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}
