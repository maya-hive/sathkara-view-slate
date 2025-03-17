"use client";

import { useState } from "react";
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
import { type ApiJSONResponse } from "@/types/ApiResponse.types";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().optional(),
});

export const ContactFormClient = () => {
  const [formSuccessMessage, setSuccessFormMessage] = useState<string | null>(
    null
  );
  const [formErrorMessage, setErrorFormMessage] = useState<string | null>(null);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          Send Message
        </Button>
      </form>
    </Form>
  );
};
