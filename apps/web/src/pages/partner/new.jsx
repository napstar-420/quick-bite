import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import config from "../../config";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { PhoneInput } from "../../components/ui/phone-input";
import { AutoComplete } from "../../components/auto-complete";
import axios from "../../services/axios";
import { API_ROUTES } from "../../lib/constants";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { isPossiblePhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { AddressForm } from "../../components/addressForm";
import { LoadingSpinner } from "../../components/loading-spinner";
import { faker } from "@faker-js/faker";

export default function PartnerNew() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForm1Submit = (data) => {
    setFormData({ ...formData, ...data });
    setFormStep(2);
  };

  const handleForm2Submit = (data) => {
    setFormData({ ...formData, ...data });
    setFormStep(3);
  };

  const handleForm3Submit = (data) => {
    setFormData({ ...formData, ...data });
    setFormStep(4);
  };

  const handleForm4Submit = (data) => {
    setFormData({ ...formData, openingHours: data.timeSlots });
    setFormStep(5);
  };

  const handleForm5Submit = async (data) => {
    setFormStep(0);
    setFormData({ ...formData, address: data });

    try {
      setLoading(true);
      await axios.post(API_ROUTES.RESTAURANTS.CREATE, {
        ...formData,
        address: data,
      });
      toast.success("Restaurant created successfully", {
        description: "Redirecting to partner dashboard...",
      });

      navigate(config.ROUTES.PARTNER, { replace: true });
    } catch (error) {
      setFormStep(5);
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b text-primary-foreground bg-primary py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={config.ROUTES.HOME} className="font-bold text-xl">
              {config.APP_NAME}
            </Link>
          </div>
        </div>
      </header>

      {formStep === 1 && <NewPartnerForm1 onSubmit={handleForm1Submit} />}
      {formStep === 2 && <NewPartnerForm2 onSubmit={handleForm2Submit} />}
      {formStep === 3 && (
        <NewPartnerForm3
          onSubmit={handleForm3Submit}
          defaultValues={{ phone: "+923001234567" }}
        />
      )}
      {formStep === 4 && <OpeningHoursForm onSubmit={handleForm4Submit} />}
      {formStep === 5 && (
        <div className="w-full flex-1 flex items-center justify-center">
          <AddressForm onSubmit={handleForm5Submit} />
        </div>
      )}

      {loading && (
        <div className="w-full h-screen bg-secondary absolute top-0 left-0 flex-1 flex flex-col items-center justify-center">
          <LoadingSpinner size="md" />
          <p className="mt-2">Submitting your request...</p>
        </div>
      )}
    </div>
  );
}

const Form1Schema = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "email must be a valid email address.",
  }),
  phone: z.string().refine(
    (value) => {
      if (!value) return false;

      try {
        // Parse the phone number to get country information
        const phoneNumberObj = parsePhoneNumber(value);
        const country = phoneNumberObj.country;

        // Check if it's a possible phone number
        return isPossiblePhoneNumber(value, country);
      } catch {
        return false;
      }
    },
    {
      message: "Please enter a valid phone number",
    },
  ),
  category: z.string().min(3, {
    message: "category must be at least 3 characters.",
  }),
  priceRange: z.string().min(1, {
    message: "price range is required.",
  }),
});

function NewPartnerForm1({ onSubmit }) {
  const [phoneNumber, setPhoneNumber] = useState("+923001234567");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const categoryAbortControllerRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(Form1Schema),
    defaultValues: {
      name: faker.person.firstName() + " food",
      email: faker.internet.email(),
      phone: "+923001234567",
      category: "Italian",
      priceRange: "$$",
    },
  });

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    // Update the form field value
    form.setValue("phone", value);
  };

  const filterCategories = async (value) => {
    if (!value || value.length < 3) return [];

    if (categoryAbortControllerRef.current) {
      categoryAbortControllerRef.current.abort();
    }

    categoryAbortControllerRef.current = new AbortController();

    try {
      setCategoryLoading(true);
      const response = await axios.get(API_ROUTES.CATEGORIES.SEARCH, {
        params: {
          q: value,
        },
        signal: categoryAbortControllerRef.current.signal,
      });

      return response.data;
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        toast.error("Error fetching categories");
      }

      return [];
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center mx-auto justify-center p-4 my-12">
      <div className="container mx-auto px-4">
        <Form {...form} className="w-full max-w-sm space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-medium text-center">
              Ready to grow your business?
            </h2>

            <div className="my-8">
              <div className="space-y-4">
                {/* Business name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Restaurant name"
                          type="text"
                          name="name"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Business email"
                          type="email"
                          name="email"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={() => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          international
                          defaultCountry="PK"
                          withCountryCallingCode
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          required
                          placeholder="Business phone"
                          numberInputProps={{
                            className: "h-14 rounded-r-md border-gray-300",
                          }}
                          buttonClassName="h-14 rounded-l-md border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <AutoComplete
                          inputClassName="h-14 rounded-md border-gray-300"
                          placeholder="Select category"
                          options={[]}
                          multiple
                          isLoading={categoryLoading}
                          optionLabel={(option) => option.name}
                          optionValue={(option) => option.id}
                          filterFunction={filterCategories}
                          emptyMessage="No categories found"
                          defaultInputValue={form.getValues("category")}
                          value={selectedCategories}
                          onSelect={(option) => {
                            field.onChange(option.name);
                            setSelectedCategories(option.name);
                          }}
                          controller={categoryAbortControllerRef}
                          onInputChange={(value) => {
                            field.onChange(value);
                          }}
                          inputprops={{
                            required: true,
                            id: "category",
                            name: "category",
                            ...field,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business price range */}
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price range</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full border-gray-300 h-14">
                            <SelectValue placeholder="Select a price range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {[
                                {
                                  value: config.PRICE_RANGES.CHEAP,
                                  label: "Cheap",
                                },
                                {
                                  value: config.PRICE_RANGES.MID,
                                  label: "Mid",
                                },
                                {
                                  value: config.PRICE_RANGES.EXPENSIVE,
                                  label: "Expensive",
                                },
                                {
                                  value: config.PRICE_RANGES.LUXURY,
                                  label: "Luxury",
                                },
                              ].map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="cursor-pointer"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Get started
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

const Form2Schema = z.object({
  description: z
    .string()
    .min(3, {
      message: "description must be at least 3 characters.",
    })
    .max(300, {
      message: "description must be less than 300 characters.",
    }),
  logo: z.string().min(3, {
    message: "logo is required.",
  }),
  coverImage: z.string().min(3, {
    message: "cover image is required.",
  }),
});

function NewPartnerForm2({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(Form2Schema),
    defaultValues: {
      description: "This is a description of my restaurant",
      logo: "https://placehold.co/400",
      coverImage: "https://placehold.co/600x400",
    },
  });

  return (
    <main className="flex-1 flex items-center justify-center p-4 my-12">
      <div className="container px-4 max-w-sm">
        <Form {...form} className="w-full space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-medium text-center">
              Add some details
            </h2>

            <div className="my-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="h-14 rounded-md border-gray-300 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Logo url"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cover image url"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

const Form3Schema = z.object({
  branchName: z.string().min(3, {
    message: "branch name is required.",
  }),
  branchPhone: z.string().min(3, {
    message: "branch phone is required.",
  }),
  branchCoverImage: z.string().min(3, {
    message: "cover image is required.",
  }),
});

function NewPartnerForm3({ onSubmit, defaultValues }) {
  const [phoneNumber, setPhoneNumber] = useState(defaultValues?.phone || "");

  const form = useForm({
    resolver: zodResolver(Form3Schema),
    defaultValues: {
      branchName: "Wahdat Road",
      branchPhone: "+923001234567",
      branchCoverImage: "https://placehold.co/600x400",
      ...defaultValues,
    },
  });

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    form.setValue("phone", value);
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 my-12">
      <div className="container px-4 max-w-sm">
        <Form {...form} className="w-full space-y-6">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-medium text-center">
              Let's add a branch
            </h2>

            <div className="my-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Branch name"
                          type="text"
                          name="name"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch phone */}
                <FormField
                  control={form.control}
                  name="branchPhone"
                  render={() => (
                    <FormItem>
                      <FormLabel>Branch phone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          id="phone"
                          name="phone"
                          international
                          defaultCountry="PK"
                          withCountryCallingCode
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          required
                          placeholder="Branch phone"
                          numberInputProps={{
                            className: "h-14 rounded-r-md border-gray-300",
                          }}
                          buttonClassName="h-14 rounded-l-md border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Branch cover image */}
                <FormField
                  control={form.control}
                  name="branchCoverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch cover image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cover image url"
                          className="h-14 rounded-md border-gray-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}

const openingHoursFormSchema = z.object({
  timeSlots: z
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
    .min(1, { message: "At least one time slot is required" }),
});

function OpeningHoursForm({ onSubmit }) {
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

  const form = useForm({
    resolver: zodResolver(openingHoursFormSchema),
    defaultValues: {
      timeSlots: [
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
      ],
    },
  });

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

  // Add a function to validate time slots before submission
  const handleSubmit = (data) => {
    // Check if any time slot has invalid time range
    const hasInvalidTimeRange = timeSlots.some((slot) => {
      // Skip validation for 24/7 slots
      if (slot.from === "00:00" && slot.to === "00:00") {
        return false;
      }

      const fromHour = parseInt(slot.from.split(":")[0]);
      const toHour = parseInt(slot.to.split(":")[0]);

      return toHour <= fromHour;
    });

    if (hasInvalidTimeRange) {
      toast.error("Closing time must be after opening time");
      return;
    }

    // If validation passes, call the original onSubmit
    onSubmit(data);
  };

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
    <main className="flex-1 flex items-center justify-center p-4 my-12">
      <div className="container px-4 max-w-md">
        <Form {...form} className="w-full space-y-6">
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h2 className="text-2xl font-medium text-center mb-6">
              Business hours
            </h2>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium">
                    Business hours templates
                  </h3>
                  <div className="mt-2">
                    <Select
                      defaultValue="custom"
                      onValueChange={handleTemplateChange}
                    >
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
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-md space-y-4"
                    >
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
                                    handleDayToggle(
                                      day.value,
                                      index,
                                      currentDays,
                                    );
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

                          {form.formState.errors.timeSlots?.[index]?.days
                            ?.message && (
                            <p role="alert" className="text-red-500 text-sm">
                              {
                                form.formState.errors.timeSlots?.[index]?.days
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
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
                                      i === index
                                        ? { ...slot, from: value }
                                        : slot,
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
                                      <SelectItem
                                        key={hour}
                                        value={`${hour}:00`}
                                      >
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
                                      const hour = i
                                        .toString()
                                        .padStart(2, "0");
                                      return (
                                        <SelectItem
                                          key={hour}
                                          value={`${hour}:00`}
                                        >
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
                      disableAddNewTimeSlot
                        ? "You can only add up to 7 time slots"
                        : ""
                    }
                  >
                    <span className="text-lg">+</span> Add new time slot
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
              >
                Save business hours
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
