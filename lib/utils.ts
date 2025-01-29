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
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' '); // Join the words back with spaces

  return properCaseStr;
};
