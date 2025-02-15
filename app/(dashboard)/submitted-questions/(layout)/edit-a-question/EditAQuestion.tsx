'use client';

import { editAQuestionAction } from '@/actions/questions';
import { QuestionForm } from '@/components/submitted-question/Form';
import useToastResult from '@/hooks/use-toast-result';
import {
  ResQuestion,
  schemaQuestion,
  SubCategoryResQuestion,
} from '@/types/question';
import constants from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

export const EditAQuestion = ({
  data,
}: {
  data: ResQuestion & SubCategoryResQuestion & { subCategory: string };
}) => {
  const { toastResHandler } = useToastResult();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof schemaQuestion>) => {
    try {
      const { message, status } = await editAQuestionAction(values, data);

      // ERROR SERVER HANDLING
      if (status !== constants('STATUS_SUCCESS')) {
        toastResHandler({ status, error: message });
        return;
      }

      // // SUCCESS HANDLING
      router.refresh();
      router.push('/submitted-questions');
    } catch (error: unknown) {
      // ERROR CLIENT HANDLING
      toastResHandler({ status: 'error', error });
    }
  };

  return <QuestionForm onSubmit={onSubmit} initialData={data} />;
};
