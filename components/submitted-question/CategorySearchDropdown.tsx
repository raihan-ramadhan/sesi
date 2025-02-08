import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input'; // Adjust the import path as needed

// Adjust the import path as needed
import debounce from 'debounce';
import { createClient } from '@/utils/supabase/client';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Control, UseFormSetValue } from 'react-hook-form';
import { schemaQuestion } from '@/types/question';
import { z } from 'zod';
import { ScrollArea } from '../ui/scroll-area';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CategorySearchDropdown({
  setValue,
  value,
  name,
  control,
  handleChange,
}: {
  value: string;
  setValue: UseFormSetValue<z.infer<typeof schemaQuestion>>;
  name: keyof z.infer<typeof schemaQuestion>;
  control: Control<z.infer<typeof schemaQuestion>, any>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenContent, setIsOpenContent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    if (term) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories') // Replace with your table name
        .select('name') // Replace with your column name
        .ilike('name', `%${term}%`) // Case-insensitive search
        .limit(10); // Limit the number of results

      if (!error && data) {
        setCategories(data.map((item) => item.name));
      }
      // setIsOpenContent(!!term);
    } else {
      setCategories([]);
    }
    setIsLoading(false);
  }, 1000); // 1s delay

  // Function to create a new category
  const createNewCategory = async () => {
    if (value.trim()) {
      setIsLoading(true);
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: value }])
        .select();

      if (!error && data) {
        setCategories([data[0].name, ...categories]); // Add the new category to the list
        setValue(name, data[0].name); // Automatically select the new category
      }
      setIsLoading(false);
      setIsOpenContent(false);
    }
  };

  useEffect(() => {
    if (!!value) {
      if (categories.length === 1 && categories[0] !== value)
        setIsOpenContent(true);
      setIsLoading(true);
    } else {
      setIsOpenContent(true);
    }
    debouncedSearch(value);
    return () => debouncedSearch.clear();
  }, [value]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sub-Category</FormLabel>
          <FormControl>
            {/* RESULT OF REQUEST / CONTENT */}
            <div className="relative">
              <div
                className={cn(
                  'hidden absolute w-full -top-1 -translate-y-full z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 p-1',
                  (isLoading || !!value) && isOpenContent && 'block',
                )}
              >
                <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[180px] w-full overflow-x-hidden">
                  {isLoading ? (
                    <div className="hover:bg-accent dark:hover:bg-accent-foreground focus:bg-accent dark:focus:bg-accent-foreground rounded-sm transition-colors flex w-full items-center py-1.5 pl-2 pr-8 text-sm cursor-pointer">
                      Loading
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <div
                        key={category}
                        className="hover:bg-accent dark:hover:bg-accent-foreground focus:bg-accent dark:focus:bg-accent-foreground rounded-sm transition-colors flex w-full cursor-pointer select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none focus:text-accent"
                        onClick={(e) => {
                          setValue(name, category);
                          setIsOpenContent(false);
                          e.preventDefault();
                          return;
                        }}
                      >
                        {category}
                      </div>
                    ))
                  ) : value.length > 0 ? (
                    <div>
                      <div className="w-full py-1.5 pl-2 pr-8 text-[12px] text-secondary-foreground">
                        Make a new sub-category:
                      </div>
                      <div
                        className="hover:bg-accent dark:hover:bg-accent-foreground focus:bg-accent dark:focus:bg-accent-foreground rounded-sm transition-colors flex w-full items-center py-1.5 pl-2 pr-8 text-sm cursor-pointer"
                        onClick={createNewCategory}
                      >
                        "{value}"
                      </div>
                    </div>
                  ) : null}
                </ScrollArea>
              </div>

              {/* Input Search Droptop */}
              <div className="relative">
                <Input
                  {...field}
                  ref={inputRef}
                  placeholder="Search a sub-category..."
                  className="relative"
                  type="text"
                  onChange={handleChange}
                />
                {isLoading ? (
                  <div className="absolute z-10 top-1/2 -translate-y-1/2 right-4">
                    <LoaderCircle className="size-4 animate-spin" />
                  </div>
                ) : null}
              </div>
            </div>
          </FormControl>
          <FormDescription>
            This is your Question's Sub-Category.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
