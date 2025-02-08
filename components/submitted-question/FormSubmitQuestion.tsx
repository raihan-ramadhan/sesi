'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { CategorySearchDropdown } from './CategorySearchDropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { submitAQuestionAction } from '@/actions/submit-a-question';
import { CATEGORIES_VALUES, schemaQuestion } from '@/types/question';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UploadQuestionImage } from './UploadImage';
import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';

type ErrorObject = {
  [K in keyof z.infer<typeof schemaQuestion>]?: string[];
};

export const FormSubmitQuestion = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [savedFormData, setSavedFormData, clearSavedFormData] = useLocalStorage<
    z.infer<typeof schemaQuestion>
  >('formData', {
    image: undefined,
    category: undefined as any,
    questionLine: '',
    rightAnswer: '',
    wrongAnswer1: '',
    wrongAnswer2: '',
    wrongAnswer3: '',
    wrongAnswer4: '',
    subCategory: '',
  });

  const myForm = useForm<z.infer<typeof schemaQuestion>>({
    resolver: zodResolver(schemaQuestion),
    defaultValues: savedFormData,
  });

  const { errors } = myForm.formState;

  // Check if any of the inputs have errors
  const wrongAnswerHasErrors =
    errors.wrongAnswer1 ||
    errors.wrongAnswer2 ||
    errors.wrongAnswer3 ||
    errors.wrongAnswer4;

  async function onSubmit(values: z.infer<typeof schemaQuestion>) {
    const { status, message } = await submitAQuestionAction(values);

    if (status !== 'success') {
      function logErrorMessages(errorObject: ErrorObject) {
        // Extract all error messages from the object
        const errors: string[] = [];

        for (const key in errorObject) {
          const value = errorObject[key as keyof ErrorObject];
          if (Array.isArray(value)) {
            errors.push(...value);
          }
        }

        // Combine all error messages into a single sentence
        const errorSentence = errors.join('. ') + '.';

        // Log the combined sentence to the console
        return errorSentence;
      }
      if (typeof message !== 'string') {
        console.log(logErrorMessages(message as ErrorObject));
      }

      return;
    }

    // clearSavedFormData();
    // myForm.reset();
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...savedFormData, [name]: value };
    setSavedFormData(updatedFormData);
    myForm.setValue(name as keyof z.infer<typeof schemaQuestion>, value);
  };

  const handleSelectChange = (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string,
  ) => {
    const updatedFormData = { ...savedFormData, [name]: value };
    setSavedFormData(updatedFormData);
    myForm.setValue(name as keyof z.infer<typeof schemaQuestion>, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    myForm.setValue('image', file as File);
    const updatedFormData = { ...savedFormData, file };
    setSavedFormData(updatedFormData);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // LOADING STATE
    return null;
  }

  return (
    <Form {...myForm}>
      <form onSubmit={myForm.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={myForm.control}
            name="questionLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write Your Question..."
                    {...field}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormDescription>This is your Question's Line.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <UploadQuestionImage
            control={myForm.control}
            name={'image'}
            handleFileChange={handleFileChange}
          />

          <FormField
            control={myForm.control}
            name="rightAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Right Answer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write Your Right Answer..."
                    {...field}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormDescription>This is your Right Answer.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className="flex w-full flex-col gap-2"
            role="group"
            aria-labelledby="group-label"
          >
            <FormLabel
              className={wrongAnswerHasErrors ? 'text-red-500' : ''}
              onClick={() => {
                const inputs = [
                  'wrongAnswer1',
                  'wrongAnswer2',
                  'wrongAnswer3',
                  'wrongAnswer4',
                ] as const;
                for (const inputName of inputs) {
                  if (
                    !myForm.control._formValues[inputName] ||
                    errors[inputName]
                  ) {
                    document.getElementById(inputName)?.focus();
                    break;
                  }
                }
              }}
            >
              Wrong Answer
            </FormLabel>
            <div className="grid grid-flow-col grid-rows-2 gap-4">
              <FormField
                control={myForm.control}
                name="wrongAnswer1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write Your Wrong Answer no 1..."
                        {...field}
                        id="wrongAnswer1"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={myForm.control}
                name="wrongAnswer2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write Your Wrong Answer no 2..."
                        {...field}
                        id="wrongAnswer2"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={myForm.control}
                name="wrongAnswer3"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write Your Wrong Answer no 3..."
                        {...field}
                        id="wrongAnswer3"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={myForm.control}
                name="wrongAnswer4"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Write Your Wrong Answer no 4..."
                        {...field}
                        id="wrongAnswer4"
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>This is your Wrong Answer.</FormDescription>
          </div>
          <FormField
            control={myForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value) =>
                      handleSelectChange('category', value)
                    }
                  >
                    <SelectTrigger className="min-w-[180px] w-full placeholder:text-red-300">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES_VALUES.map((value, index) => {
                        return (
                          <SelectItem key={index} value={value}>
                            {value}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is your Question's Category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <CategorySearchDropdown
            control={myForm.control}
            name={'subCategory'}
            value={myForm.watch('subCategory')}
            setValue={myForm.setValue}
            handleChange={handleChange}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
