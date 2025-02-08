import { z } from 'zod';

export const CATEGORIES_VALUES = ['TIU', 'TWK', 'TKP'] as const;

export type Category = (typeof CATEGORIES_VALUES)[number];

export type Question = {
  id: string;
  question: string;
  rightAnswer: string;
  wrongAnswer: string[];
  category: Category;
  subCategory: string;
  creator: {
    id: string;
    name: string;
  };
};

export const schemaQuestion = z.object({
  questionLine: z
    .string({
      invalid_type_error: 'Invalid Question Line',
    })
    .min(1, {
      message: 'Question Line is required.',
    }),
  image: z.instanceof(File).optional(),
  rightAnswer: z
    .string({
      invalid_type_error: 'Invalid Right Answer',
    })
    .min(1, {
      message: 'Righ Answer is required.',
    }),
  wrongAnswer1: z
    .string({
      invalid_type_error: 'Invalid Wrong Answer 1',
    })
    .min(1, {
      message: 'Wrong answer is required.',
    }),
  wrongAnswer2: z
    .string({
      invalid_type_error: 'Invalid Wrong Answer 2',
    })
    .min(1, {
      message: 'Wrong answer is required.',
    }),
  wrongAnswer3: z
    .string({
      invalid_type_error: 'Invalid Wrong Answer 3',
    })
    .min(1, {
      message: 'Wrong answer is required.',
    }),
  wrongAnswer4: z
    .string({
      invalid_type_error: 'Invalid Wrong Answer 4',
    })
    .min(1, {
      message: 'Wrong answer is required.',
    }),
  category: z.enum(CATEGORIES_VALUES, {
    invalid_type_error: 'Invalid Category',
    required_error: 'category is required',
  }),
  subCategory: z
    .string({
      invalid_type_error: 'Invalid Sub Category',
    })
    .min(1, {
      message: 'Subcategory is required.',
    }),
});
