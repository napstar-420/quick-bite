import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { PhoneInput } from "../../components/ui/phone-input";
import { OpeningHoursForm } from "../../components/partner/opening-hours-form";
import { OpeningHoursFormSchema, AddressSchema } from "../../lib/schemas";
import { AddressForm } from "../../components/partner/address-form";
import { getUser } from "../../lib/helpers";
import { validateTimeSlotTimeRanges } from "../../lib/utils";
import { usePartner } from "../../hooks/usePartner";
import { toast } from "sonner";
import config from "../../config";
import { Link, useNavigate } from "react-router-dom";
import axios from '../../services/axios'
import { API_ROUTES } from "../../lib/constants";

const branchSchema = z.object({
  name: z.string().min(3, { message: "Branch name is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  address: AddressSchema,
  timeSlots: OpeningHoursFormSchema,
  coverImage: z.string(),
  manager: z.string().min(1, { message: "Manager is required" }),
});

const defaultValues = {
  name: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    location: { type: "Point", coordinates: [] },
  },
  manager: "",
  timeSlots: [],
  coverImage: "https://placehold.co/600x400",
};

export default function PartnerCreateBranch() {
  const { restaurant } = usePartner();
  const [phoneNumber, setPhoneNumber] = useState(defaultValues.phone);
  const [ownerName, setOwnerName] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues,
  });

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    // Update the form field value
    form.setValue("phone", value);
  };

  const onSubmit = async (formData) => {
    const hasInvalidTimeRange = validateTimeSlotTimeRanges(formData.timeSlots);

    if (hasInvalidTimeRange) {
      toast.error("Closing time must be after opening time");
      return;
    }

    formData.openingHours = formData.timeSlots;
    delete formData.timeSlots;

    try {
      const response = await axios.post(API_ROUTES.PARTNER.CREATE_BRANCH, formData);
      toast.success("Branch created successfully!");
      navigate(config.ROUTES.PARTNER_BRANCH(response.data._id));
      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      console.error("Error creating branch:", error);
      toast.error("Error creating branch:", {
        description: error.response.data.message || "Something went wrong"
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const getOwner = async () => {
      try {
        const { data } = await getUser(restaurant.owner, signal);
        form.setValue("manager", data._id);
        setOwnerName(data.name);
      } catch (error) {
        console.error("Error fetching owner:", error);
        toast.error("Error fetching owner:", error);
      }
    };

    getOwner();

    return () => {
      controller.abort();
    };
  }, [restaurant.owner]);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        New branch application
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight col-start-1 col-end-3 mt-4">
            Branch details
          </h2>
          <div className="grid grid-cols-2 gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Cantonment, DHA phase 1"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
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
                        className: "h-10 rounded-r-md",
                      }}
                      buttonClassName="h-10 rounded-l-md"
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
                  <FormLabel>Branch cover image</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch manager</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Branch manager name"
                      type="text"
                      {...field}
                      value={ownerName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight col-start-1 col-end-3 mt-4">
              Opening hours
            </h2>

            <OpeningHoursForm form={form} className="col-start-1 col-end-3" />

            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight col-start-1 col-end-3 mt-4">
              Location
            </h2>

            <AddressForm form={form} className="col-start-1 col-end-3" />
          </div>

          <div className="grid grid-cols-2">
            <Button type="button" variant="outline">
              <Link to={config.ROUTES.PARTNER}>
                Cancel
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Please wait" : "Create branch"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
