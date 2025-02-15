import React, { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
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
import { WrongAnswers } from './WrongAnswers';
import { CATEGORIES_VALUES, schemaQuestion } from '@/types/question';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { SubCategory } from './SubCategory';
import { Button } from '../ui/button';
import { LoaderCircle, SaveIcon } from 'lucide-react';

export const QuestionForm = ({
  onSubmit,
  initialData,
  saveCallback,
}: {
  onSubmit: (values: z.infer<typeof schemaQuestion>) => Promise<void>;
  initialData: z.infer<typeof schemaQuestion>;
  saveCallback?: (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string | File,
  ) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const myForm = useForm<z.infer<typeof schemaQuestion>>({
    resolver: zodResolver(schemaQuestion),
    defaultValues: initialData,
  });

  const save = (
    name: keyof z.infer<typeof schemaQuestion>,
    value: string | File,
  ) => {
    myForm.setValue(name, value);
    if (saveCallback) saveCallback(name, value);
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

  return (
    <Form {...myForm}>
      {/* <form onSubmit={myForm.handleSubmit(onSubmit)}> */}
      <form
        onSubmit={myForm.handleSubmit(async (values) => {
          startTransition(async () => {
            try {
              onSubmit(values);
            } catch (error: unknown) {
              // ERROR CLIENT HANDLING
              console.log(error);
            }
          });
        })}
      >
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
                <FormDescription>
                  This is your Question&apos;s Line.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UPLOAD IMAGE INPUT */}
          <UploadQuestionImage
            imageName={'image'}
            imageUrlName={'imageUrl'}
            myForm={myForm}
            imageUrl={initialData.imageUrl}
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
                  This is your Question&apos;s Category.
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
          <Button type="submit" className="w-full gap-1" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Saving
              </>
            ) : (
              <>
                <SaveIcon />
                Submit
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
