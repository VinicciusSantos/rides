"use client";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
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
import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { estimateRide } from "@/services/ride.service";
import { setEstimate } from "@/store/slices/ride.slice";
import { getUser } from "@/services/auth.service";

const locationFormSchema = z.object({
  origin: z.string().min(1, "Origin is required."),
  destination: z.string().min(1, "Destination is required."),
});

type GoogleAutocomplete = google.maps.places.Autocomplete | null;

export type LocationFormValues = z.infer<typeof locationFormSchema>;

export function LocationForm() {
  const [loading, setLoading] = useState(false);
  const [autoOrigin, setAutoOrigin] = useState<GoogleAutocomplete>(null);
  const [autoDestination, setAutoDestination] =
    useState<GoogleAutocomplete>(null);

  const dispatch = useDispatch();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
    },
  });

  const handleSubmit = async (data: LocationFormValues) => {
    setLoading(true);
    try {
      const estimate = await estimateRide({
        customer_id: getUser()?.sub ?? "-1",
        origin: data.origin,
        destination: data.destination,
      });
      dispatch(setEstimate(estimate));
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Input
                    placeholder="Enter pickup location"
                    {...field}
                    disabled={loading}
                  />
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
                  <Input
                    placeholder="Enter drop-off location"
                    {...field}
                    disabled={loading}
                  />
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
