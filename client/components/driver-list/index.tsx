"use client";

import { toast } from "@/hooks/use-toast";
import { EstimatedDriver } from "@/services/ride.service";
import { RootState } from "@/store";
import { BadgeInfoIcon } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Card } from "../ui/card";
import { DriverCard } from "./driver-card";

interface DriverListProps {
  className?: string;
  drivers: EstimatedDriver[];
}

export function DriverList({ className, drivers }: DriverListProps) {
  const estimate = useSelector((state: RootState) => state.ride.estimate);

  useEffect(() => {
    if (estimate && !estimate.options.length) {
      toast({
        title: "Error",
        description: "There aren't any drivers available for this route",
        variant: "destructive",
        duration: 4000,
      });
    }
  }, [estimate]);

  return (
    <div
      className={`${className} bg-background text-foreground p-6 rounded-lg`}
    >
      <h2 className="text-2xl font-semibold mb-4">Available Drivers</h2>
      {drivers.length ? (
        <ul className="space-y-6">
          {drivers.map((driver) => (
            <li key={driver.id}>
              <DriverCard driver={driver} />
            </li>
          ))}
        </ul>
      ) : (
        <Card className="flex flex-col items-center gap-2 text-muted-foreground">
          <BadgeInfoIcon size={24} />
          <span>There aren&apos;t any drivers available for this route</span>
        </Card>
      )}
    </div>
  );
}
