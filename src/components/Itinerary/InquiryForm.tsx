"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string(),
  arrivalDate: z.date(),
  departureDate: z.date(),
  adults: z.number().min(0),
  children: z.number().min(0),
  tripType: z.string(),
  referralSource: z.string().optional(),
  message: z.string().optional(),
});

interface Props {
  itineraryCategories: ItineraryCategory[] | null;
}

type ItineraryCategory = {
  id: string;
  name: string;
};

export const ItineraryInquiryForm = ({}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      arrivalDate: new Date(),
      departureDate: new Date(),
      adults: 0,
      children: 0,
      tripType: "",
      referralSource: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 rounded-xl bg-indigo-50 p-6 space-y-6"
      >
        <div className="flex justify-between flex-col xl:flex-row gap-4 border-b border-slate-300 pt-2 pb-5">
          <div>
            <h3 className="text-3xl font-semibold">
              Ready to start your journey?
            </h3>
            <p className="mt-2 text-md font-medium">
              Choose dates, passengers, and we will take care of your dream
              vacation
            </p>
          </div>
          <div className="pr-2">
            <p className="text-md font-medium text-sky-700">
              Need Help ? Feel Free to Call us
            </p>
            <a
              href="tel:+94 333 333 333"
              className="mt-1 block text-2xl font-semibold"
            >
              +94 333 333 333
            </a>
          </div>
        </div>
        <div className="grid xl:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Name"
                    className="h-14 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="h-14 font-semibold"
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
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    type="text"
                    className="h-14 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Country of Residence"
                    type="text"
                    className="h-14 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"input"}
                          className={cn(
                            "w-full h-14 font-semibold ext-left",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"input"}
                          className={cn(
                            "w-full h-14 font-semibold text-left",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adults"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    className="h-14 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="children"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="h-14 font-semibold"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tripType"
            render={() => (
              <FormItem>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="input"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full h-14 font-semibold justify-between"
                      >
                        {value
                          ? [{ label: "Adventure", value: "adventure" }].find(
                              (item) => item.value === value
                            )?.label
                          : "Type of Trip"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                          <CommandEmpty>No items found.</CommandEmpty>
                          <CommandGroup>
                            {[{ label: "Adventure", value: "adventure" }].map(
                              (item) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={(currentValue) => {
                                    setValue(
                                      currentValue === value ? "" : currentValue
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === item.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {item.label}
                                </CommandItem>
                              )
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="referralSource"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="How did you hear about us?"
                  className="h-14 font-semibold"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Message"
                  className="h-14 font-semibold"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded bg-secondary text-white py-7 uppercase text-sm text-center font-medium"
        >
          Start Your Journey
        </Button>
      </form>
    </Form>
  );
};
