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
import { Autocomplete } from "@react-google-maps/api";
import { getRideEstimate, RideEstimateResponse } from "@/services/ride.service";

const locationFormSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
});

type GoogleAutocomplete = google.maps.places.Autocomplete | null;

export type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  className?: string;
  onSubmit: (data: RideEstimateResponse) => void;
}

export function LocationForm({ onSubmit, className }: LocationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoOrigin, setAutoOrigin] = useState<GoogleAutocomplete>(null);
  const [autoDestination, setAutoDestination] =
    useState<GoogleAutocomplete>(null);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  const handleSubmit = async (data: LocationFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const estimate = await getRideEstimate({
        customer_id: "1",
        origin: data.origin,
        destination: data.destination,
      });
      onSubmit(estimate);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (
    autocomplete: GoogleAutocomplete,
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
        onSubmit={form.handleSubmit(handleSubmit)}
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
                  onLoad={setAutoOrigin}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autoOrigin, field.onChange)
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
                  onLoad={setAutoDestination}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autoDestination, field.onChange)
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
          disabled={loading}
        >
          {loading ? "Loading..." : "Find Drivers"}
          <CarTaxiFront className="w-5 h-5" />
        </Button>
      </form>
    </Form>
  );
}
