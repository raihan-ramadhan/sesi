'use server';

import { schemaQuestion } from '@/types/question';
import { getUserSession } from './auth';
import { createClient } from '@/utils/supabase/server';

import { z } from 'zod';
import constants from '@/utils/constants';
import { randomBytes } from 'crypto';

export type State =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      message: string;
    };

export const submitAQuestionAction = async (
  values: z.infer<typeof schemaQuestion>,
) => {
  const validatedFields = schemaQuestion.safeParse(values);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors as {
        string: string[];
      },
      errorType: 'zod-error' as const,
    };
  }

  const session = await getUserSession();
  // return not authenticated user
  if (!session) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const supabase = await createClient();
  const { data } = validatedFields;
  // exclude the subCategory string line
  const { subCategory, image, ...filteredValidatedObj } = data;
  let subCategory_id: string;
  let imageUrl: string | undefined;

  if (image) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${randomBytes(16).toString('hex')}.${fileExt}`;
    const filePath = `${fileName}`;

    const arrayBuffer = await image.arrayBuffer();
    // UPLOAD IMAGE
    const { error: errorUpload } = await supabase.storage
      .from(constants('QUESTIONS_STORAGE_NAME'))
      .upload(filePath, arrayBuffer, {
        contentType: image.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (errorUpload) throw new Error(errorUpload.message);

    // GET URL
    const { data } = await supabase.storage
      .from(constants('QUESTIONS_STORAGE_NAME'))
      .getPublicUrl(filePath);

    imageUrl = data.publicUrl;
  }

  // SEARCH SUB CATEGORY ID w subCategory string
  const {
    data: isSubCategoryExist,
    error: errorSubCategoryId,
    status: statusSubCategoryId,
  } = await supabase
    .from(constants('TABLE_SUB_CATEGORIES'))
    .select('id')
    .eq('subCategory', subCategory)
    .single();

  if (errorSubCategoryId && errorSubCategoryId.code !== ('PGRST116' as const)) {
    return { statusSubCategoryId, message: errorSubCategoryId.message };
  }

  // define subCategory_id value w existing id or new one
  if (!!isSubCategoryExist) {
    subCategory_id = isSubCategoryExist.id;
  } else {
    const {
      data: newSubCategory,
      error: errorNewSubCategory,
      status: statusNewSubCategory,
    } = await supabase
      .from(constants('TABLE_SUB_CATEGORIES'))
      .insert([{ subCategory }])
      .select('id');

    if (errorNewSubCategory) {
      return { statusNewSubCategory, message: errorNewSubCategory.message };
    }

    subCategory_id = newSubCategory[0].id;
  }

  // all payload key is required except imageUrl
  const payload = {
    ...filteredValidatedObj,
    subCategory_id,
    user_id: session.user.id,
    imageUrl,
  };

  // INSERT A QUESTION
  const { error: errorInsertQuestion, status: statusInsertQuestion } =
    await supabase.from(constants('TABLE_QUESTIONS')).insert(payload);

  if (errorInsertQuestion) {
    return { statusInsertQuestion, message: errorInsertQuestion.message };
  }

  return { status: 'success' };
};
