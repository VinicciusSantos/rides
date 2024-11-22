"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CarTaxiFront } from "lucide-react";
import { cn } from "@/lib/utils";

const locationFormSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  className?: string;
  onSubmit: (data: LocationFormValues) => void;
}

export function LocationForm({ onSubmit, className }: LocationFormProps) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4 p-4 border rounded-lg", className)}
      >
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin</FormLabel>
              <FormControl>
                <Input placeholder="Enter pickup location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <Input placeholder="Enter drop-off location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full flex items-center justify-center space-x-2"
        >
          Find Drivers
          <CarTaxiFront className="w-5 h-5" />
        </Button>
      </form>
    </Form>
  );
}
