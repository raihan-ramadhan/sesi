import { columns } from '@/components/submitted-question/columns';
import { DataTable } from '@/components/submitted-question/data-table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  QuestTable,
  ResQuestion,
  SubCategoryResQuestion,
  UserNameResQuestion,
} from '@/types/question';
import constants from '@/utils/constants';
import { createClient } from '@/utils/supabase/server';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const SubmittedQuestions = async () => {
  const supabase = await createClient();
  const { data: myData } = (await supabase
    .from(constants('TABLE_QUESTIONS'))
    .select(
      `*,
      ${constants('TABLE_SUB_CATEGORIES')} (subCategory),
      ${constants('TABLE_USER_PROFILE_NAME')} (userName)
    `,
    )
    .order('created_at', { ascending: false })) as {
    data: (ResQuestion & SubCategoryResQuestion & UserNameResQuestion)[] | null;
  };

  const data: QuestTable[] =
    myData === null || myData.length === 0
      ? []
      : myData.map(
          (
            question: ResQuestion &
              SubCategoryResQuestion &
              UserNameResQuestion,
          ) => {
            const {
              user_profiles: { userName },
              user_id,
              wrongAnswer1,
              wrongAnswer2,
              wrongAnswer3,
              wrongAnswer4,
              questionLine,
              sub_categories: { subCategory },
              ...rest
            } = question;
            return {
              subCategory,
              question: questionLine,
              creator: { id: user_id, name: userName },
              wrongAnswer: [
                wrongAnswer1,
                wrongAnswer2,
                wrongAnswer3,
                wrongAnswer4,
              ],
              ...rest,
            };
          },
        );

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
