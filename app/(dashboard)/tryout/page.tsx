import { redirect } from 'next/navigation';
import { getAccountData } from '@/actions/account';
import { TryoutPage } from './Tryout';

const Dashboard: React.FC = async () => {
  const { data, message } = await getAccountData();

  if (data) {
    return <TryoutPage />;
  } else {
    console.error({ error: message });
    redirect('/sign-in');
  }
};

export default Dashboard;
