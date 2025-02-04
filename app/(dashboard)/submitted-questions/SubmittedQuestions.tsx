import { columns, Question } from '@/components/submitted-question/columns';
import { DataTable } from '@/components/submitted-question/data-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import Link from 'next/link';
const Questions: Question[] = [
  {
    id: 'twk001',
    question:
      'Pancasila sebagai dasar negara Indonesia tercantum dalam pembukaan UUD 1945 pada alinea keberapa?',
    rightAnswer: 'Alinea keempat',
    wrongAnswer: [
      'Alinea pertama',
      'Alinea kedua',
      'Alinea ketiga',
      'Tidak tercantum dalam pembukaan',
    ],
    category: 'TWK',
    subCategory: 'Pancasila dan Konstitusi',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'twk002',
    question:
      'Lagu kebangsaan Indonesia Raya pertama kali diperdengarkan pada peristiwa apa?',
    rightAnswer: 'Sumpah Pemuda 28 Oktober 1928',
    wrongAnswer: [
      'Proklamasi Kemerdekaan 17 Agustus 1945',
      'Konferensi Meja Bundar 1949',
      'Pembentukan BPUPKI 1945',
      'Pembentukan KNIP 1945',
    ],
    category: 'TWK',
    subCategory: 'Sejarah Indonesia',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'tiu001',
    question: 'Jika 3x + 5 = 20, maka nilai x adalah...',
    rightAnswer: '5',
    wrongAnswer: ['3', '4', '6', '7'],
    category: 'TIU',
    subCategory: 'Matematika Dasar',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'tiu002',
    question: 'Sinonim dari kata "prolifik" adalah...',
    rightAnswer: 'Produktif',
    wrongAnswer: ['Malas', 'Boros', 'Sederhana', 'Kreatif'],
    category: 'TIU',
    subCategory: 'Verbal Analogi',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'tkp001',
    question:
      'Ketika teman Anda melakukan kesalahan, apa yang sebaiknya Anda lakukan?',
    rightAnswer: 'Memberikan masukan secara sopan dan membangun',
    wrongAnswer: [
      'Mengabaikan kesalahan tersebut',
      'Mengungkapkannya di depan umum agar dia jera',
      'Membicarakan kesalahannya dengan orang lain',
      'Menghindari teman tersebut',
    ],
    category: 'TKP',
    subCategory: 'Integritas dan Kerjasama',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'tkp002',
    question:
      'Anda diminta menyelesaikan tugas kelompok, tetapi salah satu anggota tidak berkontribusi. Apa yang Anda lakukan?',
    rightAnswer: 'Mengajak anggota tersebut berdiskusi untuk membagi tugas',
    wrongAnswer: [
      'Menyelesaikan semua tugas sendiri',
      'Melaporkan anggota tersebut kepada atasan',
      'Mengabaikan tugas kelompok',
      'Mengeluarkan anggota tersebut dari kelompok',
    ],
    category: 'TKP',
    subCategory: 'Kerjasama Tim',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
  {
    id: 'tiu003',
    question: 'Jika A = 2, B = 4, C = 6, maka berapakah nilai dari A + B - C?',
    rightAnswer: '0',
    wrongAnswer: ['2', '4', '6', '8'],
    category: 'TIU',
    subCategory: 'Logika Matematika',
    creator: {
      id: 'creator123',
      name: 'Budi Santoso',
    },
  },
];

async function getData(): Promise<Question[]> {
  // Fetch data from your API here.
  return Questions;
}

export const SubmittedQuestions = async () => {
  const data = await getData();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Submitted Questions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="grid gap-6 mx-auto w-full p-[0_16px_16px_16px]">
        <Link
          href={'/submitted-questions/submit-a-question'}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <Plus />
          Add a Question
        </Link>
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarInset>
  );
};
