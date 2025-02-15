'use client';

import { FormLoadingState } from '@/components/submitted-question/FormLoadingState';
import { QuestionForm } from '@/components/submitted-question/Form';
import { submitQuestionAction } from '@/actions/questions';
import useLocalStorage from '@/hooks/use-local-storage';
import { schemaQuestion } from '@/types/question';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import constants from '@/utils/constants';
import useToastResult from '@/hooks/use-toast-result';

export const SubmitAQuestion = () => {
  const DEFAULT_VALUE: z.infer<typeof schemaQuestion> = {
    category: undefined as unknown as z.infer<
      typeof schemaQuestion
    >['category'],
    image: undefined,
    questionLine: '',
    rightAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: '',
    wrongAnswer4: '',
    subCategory: '',
    imageUrl: '',
  };

  const router = useRouter();
  const { toastResHandler } = useToastResult();

  const [isMounted, setIsMounted] = useState(false);
  const [savedFormData, setSavedFormData, clearSavedFormData] = useLocalStorage<
    z.infer<typeof schemaQuestion>
  >('formData', DEFAULT_VALUE);

  async function onSubmit(values: z.infer<typeof schemaQuestion>) {
    try {
      const { status, message } = await submitQuestionAction(values);

      // ERROR HANDLING
      if (status !== constants('STATUS_SUCCESS')) {
        toastResHandler({ status, error: message });
        return;
      }

      // SUCCESS HANDLING
      clearSavedFormData();
      router.refresh();
      router.push('/submitted-questions');
    } catch (error: unknown) {
      // CLIENT ERROR HANDLING
      toastResHandler({ status: 'error', error });
    }
  }

  const saveCallback = (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string | File,
  ) => {
    const updatedFormData = { ...savedFormData, [name]: value };
    setSavedFormData(updatedFormData);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // LOADING STATE wait for local storage data
    return <FormLoadingState />;
  }

  // return <FormSubmitQuestion />;
  return (
    <QuestionForm
      onSubmit={onSubmit}
      initialData={savedFormData}
      saveCallback={saveCallback}
    />
  );
};
