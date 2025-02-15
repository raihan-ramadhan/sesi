import { EditAQuestion } from './EditAQuestion';
import { createClient } from '@/utils/supabase/server';
import constants from '@/utils/constants';
import { ErrorPage } from './Error';
import { ResQuestion, SubCategoryResQuestion } from '@/types/question';

const EditAQuestionPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ questionId?: string }>;
}) => {
  const { questionId } = await searchParams;

  if (!questionId) return <ErrorPage message="Terjadi kesalahan saat kamu ." />;

  const supabase = await createClient();
  const { data } = (await supabase
    .from(constants('TABLE_QUESTIONS'))
    .select(
      `*,
          ${constants('TABLE_SUB_CATEGORIES')} (subCategory)
        `,
    )
    .eq('id', questionId)
    .single()) as {
    data: (ResQuestion & SubCategoryResQuestion) | null;
  };

  if (!data) return <ErrorPage message="Question tidak ditemukan." />;

  return (
    <EditAQuestion
      data={{
        ...data,
        subCategory: data.sub_categories.subCategory,
      }}
    />
  );
};

export default EditAQuestionPage;
