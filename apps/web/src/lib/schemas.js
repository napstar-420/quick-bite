import { z } from "zod";

export const OpeningHoursFormSchema = z
  .array(
    z
      .object({
        days: z
          .array(z.string())
          .min(1, { message: "At least one day is required" }),
        from: z.string(),
        to: z.string(),
      })
      .refine(
        (data) => {
          // Skip validation for 24/7 slots
          if (data.from === "00:00" && data.to === "00:00") {
            return true;
          }

          // Convert times to comparable values (minutes since midnight)
          const fromTime = parseInt(data.from.split(":")[0]) * 60;
          const toTime = parseInt(data.to.split(":")[0]) * 60;

          // Check if "to" time is greater than "from" time
          return toTime > fromTime;
        },
        {
          message: "Closing time must be after opening time",
        },
      ),
  )
  .min(1, { message: "At least one time slot is required" });

export const AddressSchema = z.object({
  street: z.string().min(3, { message: "Street is required" }),
  city: z.string().min(3, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(3, { message: "Zip code is required" }),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2),
  }),
});
