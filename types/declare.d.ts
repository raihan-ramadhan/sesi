import { TableMeta } from '@tanstack/react-table';
interface CustomTableMeta {
  setData: Dispatch<SetStateAction<QuestTable[]>>; // Replace `any` with the appropriate type for your data
}
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> extends CustomTableMeta {}
}
