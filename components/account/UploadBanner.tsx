'use client';

import { GradientOverlay } from '@/components/gradient-overlay';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { useUserStore } from '@/stores/useUserStore';
import { User } from '@/types/auth';
import { deleteImage } from '@/utils/client/deleteImage';
import { uploadImage } from '@/utils/client/uploadUmage';
import constants from '@/utils/constants';
import { ImageUp, LoaderCircle, Save, Trash } from 'lucide-react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useEffect, useRef, useState, useTransition } from 'react';
import useToastResult from '@/hooks/use-toast-result';

export default function UploadBanner({
  initialData: initialDataParam,
  bannerHeight,
}: {
  bannerHeight: string;
  initialData: User;
}) {
  const { user, setUser } = useUserStore();
  const [initialData, setInitialData] = useState<User>(initialDataParam);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toastResHandler } = useToastResult();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgSrc: string | StaticImport = !!user.bannerUrl
    ? user.bannerUrl
    : !!initialData.bannerUrl
      ? initialData.bannerUrl
      : '/default-banner-1.webp';

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setUser({ bannerUrl: URL.createObjectURL(file) });
    }
  };

  const uploadFile = () => {
    startTransition(async () => {
      try {
        const { data } = await uploadImage({
          file,
          keyItem: 'bannerUrl',
          oldImage: initialData.bannerUrl,
          storageName: constants('BANNERS_STORAGE_NAME'),
        });

        // successed
        toastResHandler({
          status: constants('STATUS_SUCCESS'),
          successMessage: 'Foto profil berhasil di update!',
        });
        setUser({ bannerUrl: data.publicUrl });
        setFile(undefined);
        setInitialData((prev) => ({ ...prev, bannerUrl: data.publicUrl }));
      } catch (error: unknown) {
        // failed
        toastResHandler({ status: 'error', error });
        setUser({ bannerUrl: initialData.bannerUrl });
        setFile(undefined);
      }
    });
  };

  const deleteBanner = () => {
    startTransition(async () => {
      try {
        await deleteImage({ url: user.bannerUrl, keyItem: 'bannerUrl' });

        toastResHandler({
          status: constants('STATUS_SUCCESS'),
          successMessage: 'Gambar banner berhasil di hapus!!',
        });
        setUser({ bannerUrl: '' });
        setInitialData((prev) => ({ ...prev, bannerUrl: '' }));
      } catch (error: unknown) {
        toastResHandler({ status: 'error', error });
      }
    });
  };

  useEffect(() => {
    return () => {
      setFile(undefined);
    };
  }, []);

  return (
    <div
      className={cn(
        'w-full mb-4 bg-secondary relative rounded-md overflow-clip',
        bannerHeight,
      )}
    >
      <Image
        src={imgSrc}
        alt="Banner"
        fill
        loading="lazy"
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
                  setUser({ bannerUrl: initialData.bannerUrl });
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
                {!!user.bannerUrl || !!initialData.bannerUrl
                  ? 'Ubah'
                  : 'Tambah'}{' '}
                gambar banner
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
              {!!user.bannerUrl || !!initialData.bannerUrl ? (
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
