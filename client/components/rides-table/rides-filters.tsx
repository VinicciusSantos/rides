"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Driver } from "@/services/driver.service";

const filterFormSchema = z.object({
  userId: z.string().optional(),
  driverId: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

interface FilterFormProps {
  drivers: Driver[];
}

export default function FilterForm({ drivers }: FilterFormProps) {
  const router = useRouter();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      userId: "",
      driverId: "0",
    },
  });

  const handleSubmit = async (data: FilterFormValues) => {
    const searchParams = new URLSearchParams();
    if (data.userId) searchParams.append("userId", data.userId);
    if (data.driverId && data.driverId !== "0")
      searchParams.append("driverId", data.driverId);

    router.push(`/rides?${searchParams.toString()}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 flex items-end gap-4"
      >
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter user ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Select a driver</SelectItem>
                    {drivers.map((driver) => (
                      <SelectItem
                        key={driver.driver_id}
                        value={driver.driver_id.toString()}
                      >
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="flex items-center justify-center space-x-2"
        >
          Apply Filter
        </Button>
      </form>
    </Form>
  );
}
