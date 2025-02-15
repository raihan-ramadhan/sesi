import { randomBytes } from 'crypto';
import { createClient } from '../supabase/client';
import constants from '../constants';
import { z } from 'zod';
import { ALLOWED_TYPES, MAX_SIZE } from '../image';
import { logErrorMessages } from '../utils';

export const uploadImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => ALLOWED_TYPES.includes(file.type), {
      message: 'Hanya file .jpg, .jpeg, .png, and .webp yg diterima.',
    })
    .refine((file) => file.size <= MAX_SIZE, {
      message: 'Ukuran max file adalah 5MB.',
    }),
});

export const uploadImage = async ({
  file,
  oldImage,
  keyItem,
  storageName,
}: {
  file?: File;
  storageName: string;
  oldImage: string;
  keyItem: 'bannerUrl' | 'avatarUrl';
}) => {
  const validatedFields = uploadImageSchema.safeParse({ file });
  if (!validatedFields.success)
    throw new Error(
      logErrorMessages(
        validatedFields.error.flatten().fieldErrors as {
          string: string[];
        },
      ),
    );

  const validatedFile: File = validatedFields.data.file;

  const supabase = await createClient();
  const isAuthenticated = await supabase.auth.getUser();
  if (!isAuthenticated.data.user)
    throw new Error('Silahkan login terlebih dahulu');

  const fileExt = validatedFile.name.split('.').pop();
  const fileName = `${randomBytes(16).toString('hex')}.${fileExt}`;
  const filePath = `${fileName}`;

  // UPLOAD IMAGE
  const { error: errorUpload } = await supabase.storage
    .from(storageName)
    .upload(filePath, validatedFile);

  if (errorUpload) throw new Error(errorUpload.message);

  // GET URL
  const { data } = await supabase.storage
    .from(storageName)
    .getPublicUrl(filePath);

  // UPDATE TABLE
  const { error: updateError } = await supabase
    .from(constants('TABLE_USER_PROFILE_NAME'))
    .update({ [keyItem]: data.publicUrl })
    .eq('email', isAuthenticated.data.user.email)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  // REMOVE THE OLD IMAGE IF THE IMAGE FROM SUPABASE
  if (oldImage.includes('supabase.co')) {
    const array = oldImage.split('/');
    const pathName = `${array[array.length - 2]}/${array[array.length - 1]}`;
    await supabase.storage
      .from(storageName)
      .remove([pathName])
      .catch((error: any) => {
        console.log({ error });
      });
  }

  return { data };
};
