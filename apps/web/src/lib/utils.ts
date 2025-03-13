import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  isoDateString: string,
  options?: Intl.DateTimeFormatOptions,
) {
  const date = new Date(isoDateString);
  return date.toLocaleString("en-US", options);
}
