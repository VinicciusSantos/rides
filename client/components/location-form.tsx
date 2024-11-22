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
import { useState } from "react";
import { Autocomplete, Libraries, LoadScript } from "@react-google-maps/api";

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

  const [autocompleteOrigin, setAutocompleteOrigin] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [autocompleteDestination, setAutocompleteDestination] =
    useState<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = (
    autocomplete: google.maps.places.Autocomplete | null,
    onChange: (value: string) => void
  ) => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      onChange(place?.formatted_address || "");
    }
  };

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
                <Autocomplete
                  onLoad={setAutocompleteOrigin}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autocompleteOrigin, field.onChange)
                  }
                >
                  <Input placeholder="Enter pickup location" {...field} />
                </Autocomplete>
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
                <Autocomplete
                  onLoad={setAutocompleteDestination}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autocompleteDestination, field.onChange)
                  }
                >
                  <Input placeholder="Enter drop-off location" {...field} />
                </Autocomplete>
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
