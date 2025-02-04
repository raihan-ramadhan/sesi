import { redirect } from 'next/navigation';
import { getAccountData } from '@/actions/account';
import { SubmittedQuestions } from './SubmittedQuestions';

const Dashboard: React.FC = async () => {
  const { data, message } = await getAccountData();

  if (data) {
    return <SubmittedQuestions />;
  } else {
    console.error({ error: message });
    redirect('/sign-in');
  }
};

export default Dashboard;
