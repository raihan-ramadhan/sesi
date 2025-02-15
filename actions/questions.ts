'use server';

import {
  ResQuestion,
  schemaQuestion,
  SubCategoryResQuestion,
} from '@/types/question';
import { getUserSession } from './auth';
import { createClient } from '@/utils/supabase/server';

import { z } from 'zod';
import constants from '@/utils/constants';
import { randomBytes } from 'crypto';
import { logErrorMessages } from '@/utils/utils';
import { ActionResponse } from '@/types/global';

export type State =
  | {
      status: 'success';
    }
  | {
      status: 'error';
      message: string;
    };

export const submitQuestionAction = async (
  values: z.infer<typeof schemaQuestion>,
): Promise<ActionResponse> => {
  const validatedFields = schemaQuestion.safeParse(values);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: logErrorMessages(
        validatedFields.error.flatten().fieldErrors as {
          string: string[];
        },
      ),
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

    if (errorUpload) {
      return { status: 'error', message: errorUpload.message };
    }

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

  // error PGRST116 = THE REQUEST OVER LIMIT
  if (errorSubCategoryId && errorSubCategoryId.code !== ('PGRST116' as const)) {
    return { status: statusSubCategoryId, message: errorSubCategoryId.message };
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
      return {
        status: statusNewSubCategory,
        message: errorNewSubCategory.message,
      };
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
    return {
      status: statusInsertQuestion,
      message: errorInsertQuestion.message,
    };
  }

  return { status: constants('STATUS_SUCCESS'), message: null };
};

const questionIdSchema = z.object({
  questionId: z
    .string({
      invalid_type_error: 'Invalid Question Id',
    })
    .min(1, {
      message: 'Question Id is required.',
    }),
});

export const deleteQuestionAction = async (
  formData: FormData,
): Promise<ActionResponse> => {
  const validatedFields = questionIdSchema.safeParse({
    questionId: formData.get('questionId'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: logErrorMessages(
        validatedFields.error.flatten().fieldErrors as {
          string: string[];
        },
      ),
    };
  }

  const isAuthenticated = await getUserSession();
  // return not authenticated user
  if (!isAuthenticated) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const questionId = formData.get('questionId');

  const supabase = await createClient();
  const { status, error: errorDeleteQuestion } = await supabase
    .from(constants('TABLE_QUESTIONS'))
    .delete()
    .eq('id', questionId)
    .eq('user_id', isAuthenticated.user.id);

  if (errorDeleteQuestion) {
    return { status, message: errorDeleteQuestion.message };
  }

  return { status: constants('STATUS_SUCCESS'), message: null };
};

export const editAQuestionAction = async (
  newQuestion: z.infer<typeof schemaQuestion>,
  oldQuestion: ResQuestion & SubCategoryResQuestion,
): Promise<ActionResponse> => {
  try {
    const validatedFields = schemaQuestion.safeParse(newQuestion);

    // Return early if the form data is invalid
    if (!validatedFields.success) {
      return {
        status: 'error',
        message: logErrorMessages(
          validatedFields.error.flatten().fieldErrors as {
            string: string[];
          },
        ),
      };
    }

    const session = await getUserSession();
    // return not authenticated user
    if (!session) {
      return { status: 'error', message: 'User is not authenticated' };
    }

    const supabase = await createClient();
    const { data } = validatedFields;

    // FUNCTION FOR CREATE PAYLOAD FOR UPDATED VALUE BETWEEN OLD QUESTION AND THE NEW QUESTION
    function generateUpdatePayload(
      newObj: z.infer<typeof schemaQuestion>,
      oldObj: ResQuestion & SubCategoryResQuestion,
    ) {
      const payload = {} as Partial<z.infer<typeof schemaQuestion>>;

      // Get all unique keys from both objects
      const allKeys = new Set([...Object.keys(newObj)]);

      allKeys.forEach((key) => {
        const oldValue = oldObj[key as keyof typeof oldObj];
        const newValue = newObj[key as keyof typeof newObj];

        if (oldValue !== newValue) {
          payload[key as keyof typeof newObj] = newValue as any;
        }
      });

      return payload;
    }

    // CREATE PAYLOAD FOR UPDATED VALUE BETWEEN OLD QUESTION AND THE NEW QUESTION
    let {
      subCategory,
      image,
      ...payload
    }: Partial<z.infer<typeof schemaQuestion>> & {
      subCategory_id?: string;
    } = generateUpdatePayload(data, oldQuestion);

    // SUB_CATEGORIES HANDLER
    if (subCategory) {
      const {
        data: isSubCategoryExist,
        error: errorSubCategoryId,
        status: statusSubCategoryId,
      } = await supabase
        .from(constants('TABLE_SUB_CATEGORIES'))
        .select('id')
        .eq('subCategory', subCategory)
        .single();

      if (
        errorSubCategoryId &&
        errorSubCategoryId.code !== ('PGRST116' as const)
      ) {
        return {
          status: statusSubCategoryId,
          message: errorSubCategoryId.message,
        };
      }

      // define subCategory_id value w existing id or new one
      if (!!isSubCategoryExist) {
        payload.subCategory_id = isSubCategoryExist.id;
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
          return {
            status: statusNewSubCategory,
            message: errorNewSubCategory.message,
          };
        }

        payload.subCategory_id = newSubCategory[0].id;
      }
    }

    // IMAGE HANDLER
    if (payload.imageUrl !== undefined) {
      const array = oldQuestion.imageUrl.split('/');
      const pathName = `${array[array.length - 2]}/${array[array.length - 1]}`;

      if (payload.imageUrl !== oldQuestion.imageUrl && image) {
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
        if (errorUpload) {
          return { status: 'error', message: errorUpload.message };
        }
        // GET URL
        const { data } = await supabase.storage
          .from(constants('QUESTIONS_STORAGE_NAME'))
          .getPublicUrl(filePath);

        // reset the payload.imageUrl from Blob to URL
        payload.imageUrl = data.publicUrl;
      }

      // Delete IMAGE
      if (payload.imageUrl === '' || oldQuestion.imageUrl !== '') {
        await supabase.storage
          .from(constants('STORAGE_NAME'))
          .remove([pathName]);
      }
    }

    if (Object.keys(payload).length === 0) {
      return { status: 'error', message: 'No changes detected' };
    }

    // UPDATE A QUESTION
    const { error: errorInsertQuestion, status: statusInsertQuestion } =
      await supabase
        .from(constants('TABLE_QUESTIONS'))
        .update(payload)
        .eq('id', oldQuestion.id)
        .eq('user_id', session.user.id);

    if (errorInsertQuestion) {
      return {
        status: statusInsertQuestion,
        message: errorInsertQuestion.message,
      };
    }

    return { status: constants('STATUS_SUCCESS'), message: null };
  } catch (error) {
    return { status: 'error', message: 'An unexpected error occurred' };
  }
};
