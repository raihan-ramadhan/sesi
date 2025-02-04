import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // Adjust the import path as needed
import { Button } from '@/components/ui/button'; // Adjust the import path as needed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Adjust the import path as needed
import debounce from 'debounce';
import { createClient } from '@/utils/supabase/client';

export function CategorySearchDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    if (term) {
      setIsLoading(true);
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('categories') // Replace with your table name
        .select('name') // Replace with your column name
        .ilike('name', `%${term}%`) // Case-insensitive search
        .limit(10); // Limit the number of results

      if (!error && data) {
        setCategories(data.map((item) => item.name));
      }
      setIsLoading(false);
    } else {
      setCategories([]);
    }
  }, 300); // 300ms delay

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.clear();
  }, [searchTerm]);

  // Function to create a new category
  const createNewCategory = async () => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: searchTerm }])
        .select();

      if (!error && data) {
        setCategories([data[0].name, ...categories]); // Add the new category to the list
        setSelectedCategory(data[0].name); // Automatically select the new category
      }
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full">
        <Button variant="outline">
          {selectedCategory || 'Select a sub-category'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="p-2">
          <Input
            placeholder="Search sub-categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isLoading ? (
          <DropdownMenuItem>Loading...</DropdownMenuItem>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <DropdownMenuItem
              key={category}
              onSelect={() => setSelectedCategory(category)}
            >
              {category}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem onSelect={createNewCategory}>
            Make a new sub-category: "{searchTerm}"
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
