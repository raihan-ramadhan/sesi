import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  EllipsisVertical,
  LoaderCircle,
  Pen,
  Trash,
  UserRoundPen,
} from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { deleteQuestionAction } from '@/actions/questions';
import { QuestTable } from '@/types/question';
import constants from '@/utils/constants';
import useToastResult from '@/hooks/use-toast-result';

export const MoreButtonTable = ({
  questionId,
  setData,
  name,
}: {
  questionId: string;
  setData: Dispatch<SetStateAction<QuestTable[]>>;
  name: string;
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [ispending, startTransition] = useTransition();
  const { toastResHandler } = useToastResult();

  const handleDeleteClick = () => {
    setIsAlertOpen(true);
  };

  const handleCancelDelete = () => {
    setIsAlertOpen(false);
  };

  const formAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const { status, message } = await deleteQuestionAction(formData);

        if (status == constants('STATUS_SUCCESS')) {
          toastResHandler({
            status: constants('STATUS_SUCCESS'),
            successMessage: 'Kamu berhasil menghapus pertanyaan',
          });

          if (setData)
            setData((prevData) =>
              prevData.filter((item) => item.id !== questionId),
            );
          handleCancelDelete();
        } else if (message) {
          toastResHandler({ status: 'error', error: message });
        }
      } catch (error: unknown) {
        // CLIENT ERROR HANDLING
        toastResHandler({ status: 'error', error });
      }
    });
  };

  useEffect(() => {
    const body = document.body;
    if (!isAlertOpen) body.style.pointerEvents = 'auto'; // Allow pointer events on body
    return () => {
      if (!isAlertOpen) body.style.pointerEvents = ''; // Reset when dialog closes
    };
  }, [isAlertOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/submitted-questions/edit-a-question?questionId=${questionId}`}
            >
              <Pen />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick}>
            <Trash />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserRoundPen /> <span className="w-[10ch] truncate">{name}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent inert={!isAlertOpen} aria-hidden={!isAlertOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <form action={formAction}>
              <input type="hidden" name="questionId" value={questionId} />
              <Button
                type="submit"
                disabled={ispending}
                variant={'destructive'}
              >
                {ispending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Trash />
                )}
                Delete
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
