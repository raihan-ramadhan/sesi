import { redirect } from 'next/navigation';
import { getAccountData } from '@/actions/account';
import { SubmitAQuestion } from './SubmitAQuestion';

const SubmitAQuestionPage: React.FC = async () => {
  const { data, message } = await getAccountData();

  if (data) {
    return <SubmitAQuestion />;
  } else {
    console.error({ error: message });
    redirect('/sign-in');
  }
};

export default SubmitAQuestionPage;
