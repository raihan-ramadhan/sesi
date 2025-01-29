import { redirect } from 'next/navigation';
import { AccountPage } from './account';
import { getAccountData } from '@/actions/account';

const Dashboard: React.FC = async () => {
  const { data } = await getAccountData();

  if (data) {
    return <AccountPage initialData={data} />;
  } else {
    redirect('/sign-in');
  }
};

export default Dashboard;
