'use client';

import { ColumnDef, Getter } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Question = {
  id: string;
  question: string;
  rightAnswer: string;
  wrongAnswer: string[];
  category: 'TIU' | 'TWK' | 'TKP';
  subCategory: string;
  creator: {
    id: string;
    name: string;
  };
};

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: 'question',
    header: 'Question',
  },
  {
    accessorKey: 'rightAnswer',
    header: 'Right Answer',
  },
  {
    accessorKey: 'wrongAnswer',
    header: 'Wrong Answer',
    cell: ({ getValue }: { getValue: Getter<string[]> }) => (
      <ul className="list-disc">
        {getValue().map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'subCategory',
    header: 'Sub-Category',
  },
];
