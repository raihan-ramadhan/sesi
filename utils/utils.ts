import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const toProperCase = (str: string) => {
  // Check if the input is a valid string
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Return the input as is if it's not a valid string
  }

  // Split the string into words based on spaces
  const words = str.split(' ');

  // Capitalize the first letter of each word and lowercase the rest
  const properCaseStr = words
    .map((word) => {
      if (word.length > 1) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      return word;
    })
    .join(' '); // Join the words back with spaces

  return properCaseStr;
};

export type ErrorObject = {
  string: string[] | undefined;
};

export function logErrorMessages(errorObject: ErrorObject) {
  // Extract all error messages from the object
  const errors: string[] = [];

  for (const key in errorObject) {
    const value = errorObject[key as keyof ErrorObject];
    if (Array.isArray(value)) {
      errors.push(...value);
    }
  }

  // Combine all error messages into a single sentence
  const errorSentence = errors.join('. ') + '.';

  // Log the combined sentence to the console
  return errorSentence;
}
