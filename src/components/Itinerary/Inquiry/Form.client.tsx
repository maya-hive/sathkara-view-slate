"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { type ApiJSONResponse } from "@/types/ApiResponse.types";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string(),
  arrival_date: z.date(),
  departure_date: z.date(),
  adults: z.string().min(0),
  children: z.string().min(0),
  trip_type: z.string(),
  referral: z.string().optional(),
  message: z.string().optional(),
});

interface Props {
  itineraryCategories: ItineraryCategory[] | null;
}

type ItineraryCategory = {
  id: number;
  name: string;
};

export const ItineraryInquiryFormClient = ({ itineraryCategories }: Props) => {
  const [formSuccessMessage, setSuccessFormMessage] = useState<string | null>(
    null
  );
  const [formErrorMessage, setErrorFormMessage] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inquiry/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data: ApiJSONResponse = await response.json();

      if (response.ok) {
        setSuccessFormMessage(data.message);
        form.reset();
      } else {
        setErrorFormMessage(data.message);

        if (data.errors) {
          Object.entries(data.errors).forEach(([key, errorArray]) => {
            errorArray.forEach((error) => {
              form.setError(key as keyof z.infer<typeof formSchema>, {
                message: error,
              });
            });
          });
        }
      }
    } catch (error) {
      setErrorFormMessage(`Submission failed with error: ${error}`);
    }
  }

  return (
    <Form {...form}>
      <form
        id="inquiry_form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {formSuccessMessage && (
          <div className="rounded border border-green-600 text-green-600 bg-green-50 py-2 px-4 text-md font-medium">
            {formSuccessMessage}
          </div>
        )}
        {formErrorMessage && (
          <div className="rounded border border-red-600 text-red-600 bg-red-50 py-2 px-4 text-md font-medium">
            {formErrorMessage}
          </div>
        )}
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
            name="arrival_date"
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
                            <span>Pick an Arrival Date</span>
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
            name="departure_date"
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
                            <span>Pick a Departure Date</span>
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
                    placeholder="Number of Adults"
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
                    placeholder="Number of Children"
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
            name="trip_type"
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
                        {form.getValues().trip_type
                          ? itineraryCategories?.find(
                              (item) =>
                                item.name.toString() ===
                                form.getValues().trip_type
                            )?.name
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
                            {itineraryCategories?.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.id.toString()}
                                onSelect={() => {
                                  form.setValue(
                                    "trip_type",
                                    item.name.toString()
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.getValues().trip_type ===
                                      item.name.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {item.name}
                              </CommandItem>
                            ))}
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
          name="referral"
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
                  className="min-h-24 font-semibold"
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
