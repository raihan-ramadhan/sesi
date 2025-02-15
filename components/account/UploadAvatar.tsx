'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { useUserStore } from '@/stores/useUserStore';
import { User } from '@/types/auth';
import { deleteImage } from '@/utils/client/deleteImage';
import { uploadImage } from '@/utils/client/uploadUmage';
import constants from '@/utils/constants';
import { ImageUp, LoaderCircle, Save, Trash, UserRound } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState, useTransition } from 'react';
import useToastResult from '@/hooks/use-toast-result';

export default function UploadAvatar({
  bannerHeight,
  initialData: initialDataParam,
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

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setUser({ avatarUrl: URL.createObjectURL(file) });
    }
  };

  const uploadFile = () => {
    startTransition(async () => {
      try {
        const { data } = await uploadImage({
          file,
          keyItem: 'avatarUrl',
          oldImage: initialData.avatarUrl,
          storageName: constants('AVATARS_STORAGE_NAME'),
        });

        toastResHandler({
          status: constants('STATUS_SUCCESS'),
          successMessage: 'Foto profil berhasil di update!',
        });

        setUser({ avatarUrl: data.publicUrl });
        setInitialData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
        setFile(undefined);
      } catch (error: unknown) {
        toastResHandler({ status: 'error', error });
        setUser({ avatarUrl: initialData.avatarUrl });
        setFile(undefined);
      }
    });
  };

  const deleteAvatar = () => {
    startTransition(async () => {
      try {
        await deleteImage({ url: user.avatarUrl, keyItem: 'avatarUrl' });
        toastResHandler({
          status: constants('STATUS_SUCCESS'),
          successMessage: 'Foto profil berhasil di hapus!',
        });

        setUser({ avatarUrl: '' });
        setInitialData((prev) => ({ ...prev, avatarUrl: '' }));
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
    <div className={cn('w-48 mb-4 bg-transparent absolute', bannerHeight)}>
      <div className="relative left-0 bottom-0 w-48 h-48">
        <div className="flex items-center absolute left-10 -bottom-1/2 -translate-y-1/2">
          <div className="flex items-center gap-4">
            {!!user.avatarUrl || !!initialData.avatarUrl ? (
              <div className="size-24 relative shadow-md rounded-full overflow-hidden">
                <Image
                  src={user.avatarUrl ?? initialData.avatarUrl}
                  alt={user.userName ?? initialData.userName ?? 'Profile'}
                  width={96}
                  height={96}
                  priority
                  className="size-full object-cover object-center bg-background"
                />
              </div>
            ) : (
              <div className="rounded-full w-24 h-24 bg-secondary flex justify-center items-center shadow-md">
                <UserRound className="w-12 h-12" />
              </div>
            )}

            {/* Upload Profile Image Button */}
            {!!file ? (
              <div className="flex justify-center items-center gap-1">
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
                    setUser({ avatarUrl: initialData.avatarUrl });
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
              <div className="flex justify-center items-center gap-1">
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
                {!!user.avatarUrl || !!initialData.avatarUrl ? (
                  <Button
                    type="button"
                    size={'sm'}
                    onClick={deleteAvatar}
                    variant={'destructive'}
                    className={cn(
                      'bg-black bg-opacity-40 backdrop-blur-sm hover:bg-opacity-60  hover:bg-destructive',
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
          </div>
        </div>
      </div>
    </div>
  );
}
