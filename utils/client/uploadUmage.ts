import { randomBytes } from 'crypto';
import { createClient } from '../supabase/client';
import { storageName, tableUserProfileName } from '../constants';

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
  if (!file) throw new Error('Pilih file nya terlebih dahulu');

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP formats are allowed.');
  }

  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 5MB.');
  }

  const supabase = await createClient();
  const isAuthenticated = await supabase.auth.getUser();
  if (!isAuthenticated.data.user)
    throw new Error('Silahkan login terlebih dahulu');

  const fileExt = file.name.split('.').pop();
  const fileName = `${randomBytes(16).toString('hex')}.${fileExt}`;
  const filePath = `${fileName}`;

  // UPLOAD IMAGE
  const { error: errorUpload } = await supabase.storage
    .from(storageName)
    .upload(filePath, file);

  if (errorUpload) throw new Error(errorUpload.message);

  // GET URL
  const { data } = await supabase.storage
    .from(storageName)
    .getPublicUrl(filePath);

  // UPDATE TABLE
  const { error: updateError } = await supabase
    .from(tableUserProfileName)
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
