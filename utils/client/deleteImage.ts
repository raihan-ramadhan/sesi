import constants from '../constants';
import { createClient } from '../supabase/client';

export const deleteImage = async ({
  url,
  keyItem,
}: {
  url: string;
  keyItem: 'avatarUrl' | 'bannerUrl';
}) => {
  const supabase = await createClient();
  const isAuthenticated = await supabase.auth.getUser();
  if (!isAuthenticated.data.user)
    throw new Error('Silahkan login terlebih dahulu');

  const { error: updateError } = await supabase
    .from(constants('TABLE_USER_PROFILE_NAME'))
    .update({ [keyItem]: '' })
    .eq('email', isAuthenticated.data.user.email)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  const array = url.split('/');
  const pathName = `${array[array.length - 2]}/${array[array.length - 1]}`;
  const { error: deleteImageError } = await supabase.storage
    .from(constants('STORAGE_NAME'))
    .remove([pathName]);

  if (deleteImageError) throw new Error(deleteImageError.message);
};
