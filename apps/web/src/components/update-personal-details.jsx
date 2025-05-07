import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/useAuth";
import { PhoneInput } from "./ui/phone-input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/auth/authSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import axios from '../services/axios'
import { API_ROUTES } from "../lib/constants";

const updatePersonalDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be 10 characters long" })
});

export function UpdatePersonalDetails({ children }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user.phone);

  const form = useForm({
    resolver: zodResolver(updatePersonalDetailsSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const handlePhoneChange = (value) => {
    console.log(value);
    setPhoneNumber(value);
    form.setValue("phone", value);
  };

  const onSubmit = async (data) => {
    // Check if the phone number is valid for Pakistan
    try {
      parsePhoneNumberWithError(data.phone, "PK");
    } catch {
      toast.error("Invalid phone number");
      return;
    }

    try {
      const response = await axios.put(API_ROUTES.USERS.UPDATE_PHONE(user._id), {
        phone: data.phone,
        name: data.name,
      });

      if (response.status === 200) {
        toast.success("Details updated successfully");
        dispatch(updateUser({ ...user, ...response.data }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update details");
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit details</DialogTitle>
          <DialogDescription>
            Make changes to your details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="h-10 rounded-md col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@doe.com"
                        className="h-10 rounded-md col-span-3"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
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
                        placeholder="Branch phone"
                        className="col-span-3"
                        numberInputProps={{
                          className: "h-10 rounded-r-md border-gray-300",
                        }}
                        buttonClassName="h-10 rounded-l-md border-gray-300"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
