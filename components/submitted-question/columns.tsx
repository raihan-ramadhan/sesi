'use client';

import { Question } from '@/types/question';
import { ColumnDef, Getter } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
