import { z } from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { schemaQuestion } from '@/types/question';
import { Control, UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import { useRef, useState } from 'react';

export const UploadQuestionImage = ({
  control,
  name,
  myForm,
}: {
  name: keyof z.infer<typeof schemaQuestion>;
  control: Control<z.infer<typeof schemaQuestion>, any>;
  myForm: UseFormReturn<z.infer<typeof schemaQuestion>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      myForm.setValue(name, file);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Image Url <span>*optional</span>
          </FormLabel>
          <div className="flex flex-col gap-1">
            {preview ? (
              <div className="relative w-fit">
                <Image
                  src={preview}
                  alt={"Question's image"}
                  width={96}
                  height={96}
                  className="w-52 shadow-sm object-cover object-center bg-background"
                />
                <div
                  onClick={() => {
                    setPreview(undefined);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    myForm.setValue(name, undefined);
                  }}
                  className="absolute group top-2 right-2 cursor-pointer bg-black/10 hover:bg-destructive backdrop-blur-sm p-1.5 rounded-sm"
                >
                  <Trash size={18} className="text-white" />
                </div>
              </div>
            ) : null}

            <FormControl>
              <Input
                {...field}
                placeholder="Write Your Question..."
                value={undefined}
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                accept="image/jpeg, image/png, image/webp"
                type="file"
              />
            </FormControl>
          </div>
          <FormDescription>This is your Question's Image.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
