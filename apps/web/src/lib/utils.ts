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

export function validateTimeSlotTimeRanges(
  timeSlots: { days: string[]; from: string; to: string }[],
): boolean {
  return timeSlots.some((slot) => {
    // Skip validation for 24/7 slots
    if (slot.from === "00:00" && slot.to === "00:00") {
      return false;
    }

    const fromHour = parseInt(slot.from.split(":")[0]);
    const toHour = parseInt(slot.to.split(":")[0]);

    return toHour <= fromHour;
  });
}
