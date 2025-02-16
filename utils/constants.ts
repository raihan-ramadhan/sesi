const STORAGE_NAME_VAR = 'sesi_bucket';

const obj = {
  STORAGE_NAME: STORAGE_NAME_VAR,
  AVATARS_STORAGE_NAME: `${STORAGE_NAME_VAR}/avatar`,
  BANNERS_STORAGE_NAME: `${STORAGE_NAME_VAR}/banner`,
  QUESTIONS_STORAGE_NAME: `${STORAGE_NAME_VAR}/questions`,
  TABLE_USER_PROFILE_NAME: `user_profiles`,
  TABLE_SUB_CATEGORIES: `sub_categories`,
  TABLE_QUESTIONS: `questions`,
  STATUS_SUCCESS: 'success',
} as const;

export default function constants(objKey: keyof typeof obj) {
  return obj[objKey];
}
