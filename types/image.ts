import { z } from 'zod';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageSchema = z
  .any()
  .refine((file) => {
    if (file.size === 0 || file.name === undefined) return false;
    else return true;
  }, 'Pilih atau Perbarui file nya.')

  .refine(
    (file) => ALLOWED_TYPES.includes(file?.type),
    'Hanya file .jpg, .jpeg, .png and .webp yg diterima.',
  )
  .refine((file) => file.size <= MAX_SIZE, `Max file size is 5MB.`);
