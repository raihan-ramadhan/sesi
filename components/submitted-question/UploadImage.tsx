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
import { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import { MoreVertical, Pen, Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const UploadQuestionImage = ({
  imageName,
  imageUrlName,
  myForm,
  imageUrl,
}: {
  imageName: keyof Pick<z.infer<typeof schemaQuestion>, 'image'>;
  imageUrlName: keyof Pick<z.infer<typeof schemaQuestion>, 'imageUrl'>;
  myForm: UseFormReturn<z.infer<typeof schemaQuestion>>;
  imageUrl: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(imageUrl);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      myForm.setValue(imageName, file);
      myForm.setValue(imageUrlName, URL.createObjectURL(file));
    }
  };

  return (
    <>
      <FormField
        name="imageUrl"
        control={myForm.control}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <input
                {...field}
                type="url"
                className="hidden"
                value={preview}
                name="imageUrl"
                readOnly
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={myForm.control}
        name={imageName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Image Url <span>*optional</span>
            </FormLabel>
            <div className="flex flex-col gap-1">
              {!!preview ? (
                <div className="relative w-fit">
                  <Image
                    src={preview}
                    alt={"Question's image"}
                    width={96}
                    height={96}
                    className="h-52 w-fit shadow-sm object-cover object-center bg-background"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="absolute group top-1 right-1 bg-black/10 backdrop-blur-sm rounded-sm">
                      <MoreVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      <DropdownMenuItem
                        onClick={() => {
                          if (fileInputRef.current)
                            fileInputRef.current.click();
                        }}
                      >
                        <Pen size={18} />
                        Change
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setPreview('');
                          myForm.setValue(imageUrlName, '');
                          myForm.setValue(imageName, undefined);
                          if (fileInputRef.current)
                            fileInputRef.current.value = '';
                        }}
                      >
                        <Trash size={18} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
            <FormDescription>
              This is your Question&apos;s Image.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
