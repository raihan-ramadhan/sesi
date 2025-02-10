'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SubCategory } from './SubCategory';
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
import { useToast } from '@/hooks/use-toast';
import { logErrorMessages } from '@/lib/utils';
import { WrongAnswers } from './WrongAnswers';
import { FormLoadingState } from './FormLoadingState';

const DEFAULT_VALUE = {
  image: undefined,
  category: undefined as any,
  questionLine: '',
  rightAnswer: '',
  wrongAnswer1: '',
  wrongAnswer2: '',
  wrongAnswer3: '',
  wrongAnswer4: '',
  subCategory: '',
};

export const FormSubmitQuestion = () => {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [savedFormData, setSavedFormData, clearSavedFormData] = useLocalStorage<
    z.infer<typeof schemaQuestion>
  >('formData', DEFAULT_VALUE);

  const myForm = useForm<z.infer<typeof schemaQuestion>>({
    // resolver: zodResolver(schemaQuestion),
    defaultValues: savedFormData,
  });

  async function onSubmit(values: z.infer<typeof schemaQuestion>) {
    const { status, message, errorType } = await submitAQuestionAction(values);

    // ERROR HANDLING
    if (status !== 'success') {
      if (errorType === 'zod-error') {
        toast({
          variant: 'destructive',
          title: 'Gagal!',
          description: logErrorMessages(message) ?? 'Terjadi sebuah kesalahan',
        });
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Gagal!',
        description:
          typeof message === 'string' ? message : 'Terjadi sebuah kesalahan',
      });

      return;
    }

    // SUCCESS HANDLING
    // clearSavedFormData();
    // myForm.reset();
  }

  const save = (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string | File,
  ) => {
    const updatedFormData = { ...savedFormData, [name]: value };
    setSavedFormData(updatedFormData);
    myForm.setValue(name, value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    save(name as keyof z.infer<typeof schemaQuestion>, value);
  };

  const handleSelectChange = (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string,
  ) => {
    save(name as keyof z.infer<typeof schemaQuestion>, value);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // LOADING STATE
    return <FormLoadingState />;
  }

  return (
    <Form {...myForm}>
      <form onSubmit={myForm.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          {/* TEXTAREA INPUT */}
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

          {/* UPLOAD IMAGE INPUT */}
          <UploadQuestionImage
            control={myForm.control}
            name={'image'}
            myForm={myForm}
          />

          {/* RIGHT ANSWER INPUT */}
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

          {/* WRONG ASNWER INPUT NO 1-4 */}
          <WrongAnswers
            errors={myForm.formState.errors}
            myForm={myForm}
            handleChange={handleChange}
          />

          {/* CATEGORY INPUT */}
          <FormField
            control={myForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="category">Category</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(value) =>
                      handleSelectChange('category', value)
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="min-w-[180px] w-full placeholder:text-red-300"
                    >
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

          {/* SUBCATEGORY DROPDOWN INPUT */}
          <SubCategory
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
