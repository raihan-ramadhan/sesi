import constants from '@/utils/constants';
import { useToast } from './use-toast';

const useToastResult = () => {
  const { toast } = useToast();

  const toastResHandler = ({
    status,
    error,
    successMessage,
  }: {
    status: string | number;
    error?: unknown;
    successMessage?: string;
  }) => {
    if (status === constants('STATUS_SUCCESS')) {
      toast({
        title: 'Sukses!',
        description: successMessage || 'Operasi berhasil dilakukan!',
      });
    } else {
      let errorMessage;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      toast({
        variant: 'destructive',
        title: 'Gagal!',
        description: errorMessage || 'Terjadi kesalahan! Silahkan coba lagi.',
      });
    }
  };

  return { toastResHandler };
};

export default useToastResult;
