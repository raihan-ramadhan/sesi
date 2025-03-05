import { FieldErrors, UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { z } from 'zod';
import { schemaQuestion } from '@/types/question';

export function WrongAnswers({
  errors,
  myForm,
  handleChange,
}: {
  errors: FieldErrors<z.infer<typeof schemaQuestion>>;
  myForm: UseFormReturn<z.infer<typeof schemaQuestion>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // Check if any of the inputs have errors
  const wrongAnswerHasErrors =
    errors.wrongAnswer1 ||
    errors.wrongAnswer2 ||
    errors.wrongAnswer3 ||
    errors.wrongAnswer4;

  const inputs = [
    'wrongAnswer1',
    'wrongAnswer2',
    'wrongAnswer3',
    'wrongAnswer4',
  ] as const;

  return (
    <div
      className="flex w-full flex-col gap-2"
      role="group"
      aria-labelledby="group-label"
    >
      <FormLabel
        className={wrongAnswerHasErrors ? 'text-red-500' : ''}
        onClick={() => {
          for (const inputName of inputs) {
            if (!myForm.control._formValues[inputName] || errors[inputName]) {
              document.getElementById(inputName)?.focus();
              break;
            }
          }
        }}
      >
        Wrong Answer
      </FormLabel>
      <div className="grid grid-flow-col grid-rows-2 gap-4">
        {inputs.map((name, index) => {
          return (
            <FormField
              key={index}
              control={myForm.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Write Your Wrong Answer no ${index + 1}...`}
                        {...field}
                        id={name}
                        onChange={handleChange}
                      />
                      <div className="border border-input rounded-md w-fit whitespace-nowrap px-3 flex items-center gap-1 justify-center">
                        {myForm.watch('category') === 'TKP' ? (
                          <span>{index + 1}</span>
                        ) : (
                          <span>0</span>
                        )}
                        Point
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
      <FormDescription>This is your Wrong Answer.</FormDescription>
    </div>
  );
}
