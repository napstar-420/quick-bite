import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { useState } from "react";

const priceSchema = z
  .string({
    required_error: "Price is required",
  })
  .refine(
    (value) => {
      // Check if the string is a valid number
      const parsedValue = parseFloat(value);
      return !isNaN(parsedValue);
    },
    {
      message: "Price must be a valid number",
    },
  )
  .refine(
    (value) => {
      // Ensure the price is non-negative
      const parsedValue = parseFloat(value);
      return parsedValue >= 0;
    },
    {
      message: "Price must be a non-negative number",
    },
  )
  .refine(
    (value) => {
      // Optionally, validate the format (e.g., up to two decimal places)
      return /^\d+(\.\d{1,2})?$/.test(value);
    },
    {
      message: "Price must have up to two decimal places",
    },
  );

const menuItemSchema = z.object({
  name: z
    .string()
    .nonempty("Item name is required")
    .min(3, { message: "Item name should be at least 3 characters long" }),
  description: z
    .string()
    .nonempty("Item description is required")
    .min(3, { message: "Description should be at least 3 characters long" }),
  price: priceSchema,
  img_url: z.string().url({ message: "Not a valid URL" }),
  isAvailable: z.boolean().default(true),
});

export function MenuItemDialog({
  handleSubmit,
  type = "create",
  defaultValues = {
    name: "",
    description: "",
    price: "",
    img_url: "https://placehold.co/600x400",
    isAvailable: true,
  },
  children,
}) {
  const [open, setOpen] = useState(false);
  const submitLabel =
    type === "create" ? "Create menu item" : "Update menu item";

  const form = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues,
  });

  const onSubmit = async (formData) => {
    if (type === "create") {
      await handleSubmit(formData);
      return setOpen(false);
    }

    // Create an object with only the fields that have changed
    const data = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== defaultValues[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // Submit the changed data
    if (!isEmpty(data)) {
      await handleSubmit(data);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} setOpen={setOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add menu item</DialogTitle>
          <DialogDescription>Add a new item to your menu</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Chicken burger"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your menu item"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Img URL field */}
              <FormField
                control={form.control}
                name="img_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability field */}
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="item-available">Available</FormLabel>
                    <FormControl>
                      <Switch
                        id="item-available"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isDirty}>
                {form.formState.isSubmitting ? "Please wait" : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

MenuItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
