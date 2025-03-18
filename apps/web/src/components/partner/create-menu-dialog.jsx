import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { MultiSelect } from "../ui/multi-select";
import { useEffect } from "react";

const menuSchema = z.object({
  name: z.string().min(3, { message: "Menu name is required" }),
  isAvailable: z.boolean().default(true),
  branches: z
    .array(z.string())
    .min(1, { message: "At least one branch is required" }),
});

export function CreateMenuDialog({ open, setOpen, handleSubmit, options }) {
  const form = useForm({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      isAvailable: true,
      branches: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      form.clearErrors();
    }
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Menu</DialogTitle>
          <DialogDescription>
            Add a new menu category to organize your items
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Breakfast, Lunch, Desserts"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name="branches"
                control={form.control}
                render={({ field }) => (
                  <MultiSelect
                    options={options}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select branches"
                    emptyText="No branches found"
                  />
                )}
              />

              {form.formState.errors?.branches?.message && (
                <p role="alert" className="text-red-500 text-sm">
                  {form.formState.errors?.branches?.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="menu-available">Available</FormLabel>
                    <FormControl>
                      <Switch
                        id="menu-available"
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
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Menu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
