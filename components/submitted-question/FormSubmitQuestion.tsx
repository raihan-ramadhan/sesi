'use client';

import { CheckCircle, CircleX } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CategorySearchDropdown } from './CategorySearchDropdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const FormSubmitQuestion = () => {
  // YG HARUS DIPERHATIKAN SOAL, JAWABAN (YG BENAR DAN YG SALAH), CATEGORY, SUB-CATEGORY, more (EDIT, DELETE, SI-PEMBUAT)
  return (
    <form action="">
      <div className="flex flex-col gap-3">
        <div className="flex w-full gap-3">
          <div className="w-full h-auto flex flex-col gap-3">
            <Label htmlFor="questionLine" className="text-sm">
              Question
            </Label>
            <Textarea
              name="questionLine"
              id="questionLine"
              className="w-full h-full"
              required
            />
          </div>
          <div className="flex flex-col w-full gap-3">
            <Label className="text-sm">Answer</Label>
            <Label
              htmlFor="answer"
              className="text-sm flex items-center gap-2 text-green-600"
            >
              <CheckCircle size={16} />
              Right Answer :
            </Label>
            <Input id="answer" required type="text" />
            <Label
              htmlFor="wrongAnswer"
              className="text-sm flex items-center gap-2 text-red-500"
            >
              <CircleX size={16} />
              Wrong Answers :
            </Label>
            <Input id="wrongAnswer" required type="text" />
            <Input required type="text" />
            <Input required type="text" />
            <Input required type="text" />
          </div>
        </div>
        <div className="flex w-full gap-3">
          <Select required>
            <SelectTrigger className="min-w-[180px] w-full">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">TWK</SelectItem>
              <SelectItem value="dark">TIU</SelectItem>
              <SelectItem value="system">TKP</SelectItem>
            </SelectContent>
          </Select>
          <CategorySearchDropdown />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
};
