import { useState, useEffect, useRef } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { schemaQuestion } from '@/types/question';
import { createClient } from '@/utils/supabase/client';
import { LoaderCircle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import { z } from 'zod';
import debounce from 'debounce';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import constants from '@/utils/constants';

export function SubCategory({
  setValue,
  value,
  name,
  control,
  handleChange,
}: {
  value: string;
  setValue: UseFormSetValue<z.infer<typeof schemaQuestion>>;
  name: keyof Pick<z.infer<typeof schemaQuestion>, 'subCategory'>; // basically this mean subCategory, sorry to complicated this, i only want the string come from schemaQuestion but the normal way cause a trouble fo some reason;
  control: Control<z.infer<typeof schemaQuestion>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) {
  const [categories, setCategories] = useState<
    { id: string; subCategory: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenContent, setIsOpenContent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce(async (term: string) => {
    if (term) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from(constants('TABLE_SUB_CATEGORIES'))
        .select('id, subCategory')
        .ilike('subCategory', `%${term}%`) // Case-insensitive search
        .limit(10);

      if (!error && data) {
        setCategories(data);
      }
    } else {
      setCategories([]);
    }
    setIsLoading(false);
  }, 2000); // 1s delay

  const createNewCategory = async () => {
    try {
      if (value.trim()) {
        setIsLoading(true);
        const supabase = await createClient();

        const { data, error } = await supabase
          .from(constants('TABLE_SUB_CATEGORIES'))
          .insert([{ subCategory: value }])
          .select('id, subCategory');

        if (!error && data) {
          setCategories([data[0], ...categories]);
          setValue(name, data[0].subCategory);
        }
        setIsLoading(false);
        setIsOpenContent(false);
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    handleChange(e);
    setIsOpenContent(!!value);
    setIsLoading(!!value);

    if (!!value) {
      debouncedSearch(value);
    } else {
      setCategories([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenContent(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => debouncedSearch.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>Sub-Category</FormLabel>
          <FormControl>
            {/* DROPDOWN OF RESULT */}
            <div className="relative" ref={dropdownRef}>
              <div
                className={cn(
                  'absolute w-full z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none p-1 !left-0 !-top-1',
                  isOpenContent ? 'animate-custom-open' : 'hidden',
                )}
              >
                <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[180px] w-full overflow-x-hidden">
                  {isLoading ? (
                    <div className="hover:bg-accent dark:hover:bg-accent-foreground focus:bg-accent dark:focus:bg-accent-foreground rounded-sm transition-colors flex w-full items-center py-1.5 pl-2 pr-8 text-sm cursor-pointer">
                      Loading
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map(({ subCategory }) => (
                      <div
                        key={subCategory}
                        className="hover:bg-accent dark:hover:bg-accent-foreground focus:bg-accent dark:focus:bg-accent-foreground rounded-sm transition-colors flex w-full cursor-pointer select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none focus:text-accent"
                        onClick={(e) => {
                          setValue(name, subCategory);
                          setIsOpenContent(false);
                          e.preventDefault();
                          return;
                        }}
                      >
                        {subCategory}
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
                        &quot;{value}&quot;
                      </div>
                    </div>
                  ) : null}
                </ScrollArea>
              </div>

              {/* Input Search Droptop */}
              <div className="relative w-full">
                <Input
                  {...field}
                  placeholder="Search a sub-category..."
                  className="relative"
                  type="text"
                  onChange={onChange}
                  id={name}
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
            This is your Question&apos;s Sub-Category.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
