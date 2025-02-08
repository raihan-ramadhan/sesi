'use server';

import { schemaQuestion } from '@/types/question';
import { getUserSession } from './auth';
import { randomBytes } from 'crypto';
import { createClient } from '@/utils/supabase/server';
import { questionsStorageName } from '@/utils/constants';
import { z } from 'zod';

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
  const session = await getUserSession();
  // return not authenticated user
  if (!session) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const validatedFields = schemaQuestion.safeParse(values);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors,
    };
  }
  const supabase = await createClient();

  const { data: validatedData } = validatedFields;

  console.log(validatedData);

  // const file = validatedData.image;

  // if (file) {
  //   const fileExt = file.name.split('.').pop();
  //   const fileName = `${randomBytes(16).toString('hex')}.${fileExt}`;
  //   const filePath = `${fileName}`;

  //   const arrayBuffer = await file.arrayBuffer();
  //   // UPLOAD IMAGE
  //   const { error: errorUpload } = await supabase.storage
  //     .from(questionsStorageName)
  //     .upload(filePath, arrayBuffer, {
  //       contentType: file.type,
  //       cacheControl: '3600',
  //       upsert: false,
  //     });

  //   if (errorUpload) throw new Error(errorUpload.message);

  //   // GET URL
  //   const { data } = await supabase.storage
  //     .from(questionsStorageName)
  //     .getPublicUrl(filePath);

  //   // UPDATE TABLE
  // }

  return { status: 'success' };
};
