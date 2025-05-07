import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { cn } from "@/lib/utils";

// TODO: use this component when creating new restaurant
export function OpeningHoursForm({ form, className }) {
  const daysOfWeek = [
    { label: "M", value: "monday", fullName: "Monday" },
    { label: "T", value: "tuesday", fullName: "Tuesday" },
    { label: "W", value: "wednesday", fullName: "Wednesday" },
    { label: "T", value: "thursday", fullName: "Thursday" },
    { label: "F", value: "friday", fullName: "Friday" },
    { label: "S", value: "saturday", fullName: "Saturday" },
    { label: "S", value: "sunday", fullName: "Sunday" },
  ];

  const [timeSlots, setTimeSlots] = useState([
    {
      days: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      from: "09:00",
      to: "18:00",
    },
  ]);

  const addNewTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      {
        days: [],
        from: "00:00",
        to: "00:00",
      },
    ]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleDayToggle = (day, slotIndex, currentDays) => {
    const isSelected = currentDays.includes(day);
    let updatedDays;

    if (isSelected) {
      updatedDays = currentDays.filter((d) => d !== day);
    } else {
      updatedDays = [...currentDays, day];
    }

    setTimeSlots(
      timeSlots.map((slot, i) =>
        i === slotIndex ? { ...slot, days: updatedDays } : slot,
      ),
    );
  };

  const disableAddNewTimeSlot =
    timeSlots.length >= 7 ||
    timeSlots.map((slot) => slot.days.length).reduce((a, b) => a + b, 0) >= 7;

  const templatesActions = {
    "24-7": () =>
      setTimeSlots([
        {
          days: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          from: "00:00",
          to: "00:00",
        },
      ]),
    weekdays: () =>
      setTimeSlots([
        {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          from: "09:00",
          to: "18:00",
        },
      ]),
    weekends: () =>
      setTimeSlots([
        {
          days: ["saturday", "sunday"],
          from: "09:00",
          to: "18:00",
        },
      ]),
    custom: () => {
      setTimeSlots([
        {
          days: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          from: "09:00",
          to: "18:00",
        },
      ]);
    },
  };

  const handleTemplateChange = (value) => {
    templatesActions[value]();
  };

  useEffect(() => {
    form.setValue("timeSlots", timeSlots);
  }, [timeSlots]);

  // Add a function to validate time selection in real-time
  const handleToTimeChange = (value, index) => {
    const fromTime = parseInt(timeSlots[index].from.split(":")[0]);
    const toTime = parseInt(value.split(":")[0]);

    // For 24/7 slots, allow any time
    if (timeSlots[index].from === "00:00" && value === "00:00") {
      setTimeSlots(
        timeSlots.map((slot, i) =>
          i === index ? { ...slot, to: value } : slot,
        ),
      );
      return;
    }

    // Show warning if to time is less than or equal to from time
    if (toTime <= fromTime) {
      toast.warning("Closing time should be after opening time");
    }

    setTimeSlots(
      timeSlots.map((slot, i) => (i === index ? { ...slot, to: value } : slot)),
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-sm font-medium">Branch hours</h3>
        <div className="mt-2">
          <Select defaultValue="custom" onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24-7">24/7</SelectItem>
              <SelectItem value="weekdays">Weekdays</SelectItem>
              <SelectItem value="weekends">Weekends</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time slots */}
      <div className="space-y-4">
        <div className="text-sm font-medium">Time slots</div>

        {timeSlots.map((field, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-md space-y-4">
            <div>
              <div className="text-sm mb-2">Available on</div>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => {
                  const currentDays = timeSlots[index]?.days || [];
                  const isSelected = currentDays.includes(day.value);
                  const isDisabled = timeSlots
                    .filter((_, i) => i !== index)
                    .some((f) => f.days.includes(day.value));

                  return (
                    <Button
                      key={day.value}
                      variant={isSelected ? "default" : "outline"}
                      size="icon"
                      disabled={isDisabled}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isDisabled) {
                          handleDayToggle(day.value, index, currentDays);
                        }
                      }}
                      className={`rounded-full w-8 h-8 ${
                        isDisabled && !isSelected
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      title={`${day.fullName}${isDisabled ? " (already selected in another time slot)" : ""}`}
                    >
                      {day.label}
                    </Button>
                  );
                })}
              </div>
              {form.formState.errors.timeSlots?.[index]?.days?.message && (
                <p role="alert" className="text-red-500 mt-2 text-sm">
                  {form.formState.errors.timeSlots?.[index]?.days?.message}
                </p>
              )}
            </div>

            {/* Rest of the time slot UI */}
            <div className="grid grid-cols-2 gap-4">
              {/* From time */}
              <div>
                <div className="text-sm mb-2">From</div>
                <FormField
                  control={form.control}
                  name={`timeSlots.${index}.from`}
                  render={() => (
                    <Select
                      onValueChange={(value) => {
                        setTimeSlots(
                          timeSlots.map((slot, i) =>
                            i === index ? { ...slot, from: value } : slot,
                          ),
                        );
                      }}
                      value={field.from}
                    >
                      <SelectTrigger className="w-full h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {`${hour}:00`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* To time */}
              <div>
                <div className="text-sm mb-2">To</div>
                <FormField
                  control={form.control}
                  name={`timeSlots.${index}.to`}
                  render={() => {
                    return (
                      <Select
                        onValueChange={(value) => {
                          handleToTimeChange(value, index);
                        }}
                        value={field.to}
                      >
                        <SelectTrigger className="w-full h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>

            {form.formState.errors.timeSlots?.[index]?.message && (
              <p role="alert" className="text-red-500 text-sm">
                {form.formState.errors.timeSlots?.[index]?.message}
              </p>
            )}

            {/* Remove button */}
            {timeSlots.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeTimeSlot(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Add new time slot button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewTimeSlot}
          className="w-full flex items-center justify-center gap-1"
          disabled={disableAddNewTimeSlot}
          title={
            disableAddNewTimeSlot ? "You can only add up to 7 time slots" : ""
          }
        >
          <span className="text-lg">+</span> Add new time slot
        </Button>
      </div>
    </div>
  );
}
