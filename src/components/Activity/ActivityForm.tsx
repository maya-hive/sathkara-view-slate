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
import { Textarea } from "@/components/ui/textarea";

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

export const ActivityInquiryForm = () => {
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

  return (
    <Form {...form}>
      <form
        id="inquiry_form"
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
        </div>
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
