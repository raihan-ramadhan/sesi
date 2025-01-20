import { checkIsAuthenticated } from '@/lib/auth/checkIsAuthenticated';
import { redirect } from 'next/navigation';
import { AccountPage } from './account';

const Dashboard: React.FC = async () => {
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect('/auth/sign-in');
  } else {
    return <AccountPage />;
  }
};

export default Dashboard;
