'use client';

import { QuestTable } from '@/types/question';
import { ColumnDef, Getter } from '@tanstack/react-table';
import { MoreButtonTable } from './MoreButtonTable';

export const columns: ColumnDef<QuestTable>[] = [
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
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const {
        id,
        creator: { name },
      } = row.original;
      const setData = table.options.meta?.setData;

      return <MoreButtonTable questionId={id} setData={setData} name={name} />;
    },
  },
];
