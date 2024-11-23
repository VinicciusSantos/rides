"use client";

import { toast } from "@/hooks/use-toast";
import { confirmRide, EstimatedDriver } from "@/services/ride.service";
import { RootState } from "@/store";
import { clearEstimate } from "@/store/slices/ride.slice";
import { BadgeInfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "../ui/card";
import { DriverCard } from "./driver-card";

interface DriverListProps {
  className?: string;
  drivers: EstimatedDriver[];
}

export function DriverList({ className, drivers }: DriverListProps) {
  const estimate = useSelector((state: RootState) => state.ride.estimate);
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const dispatch = useDispatch();

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

  const handleSelectDriver = async (driverId: number) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!estimate || !driver) {
      return toast({
        title: "Error",
        description: "No ride estimate available",
        variant: "destructive",
        duration: 4000,
      });
    }

    setLoading(true);
    setSelectedDriver(driverId);

    try {
      const { success } = await confirmRide({
        customer_id: "1", // TODO: Replace com ID real do cliente
        origin: estimate.origin.address as string,
        destination: estimate.destination.address as string,
        distance: estimate.distance,
        duration: estimate.duration,
        driver: {
          id: driver.id,
          name: driver.name,
        },
        value: driver.value,
      });

      if (success) {
        dispatch(clearEstimate());
        toast({
          title: "Ride Confirmed",
          description: `Your ride with ${driver.name} has been confirmed.`,
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
      setSelectedDriver(null);
    }
  };

  return (
    <div
      className={`${className} bg-background text-foreground p-6 rounded-lg`}
    >
      <h2 className="text-2xl font-semibold mb-4">Available Drivers</h2>
      {drivers.length ? (
        <ul className="space-y-6">
          {drivers.map((driver) => (
            <li key={driver.id}>
              <DriverCard
                driver={driver}
                onSelect={handleSelectDriver}
                loading={loading && selectedDriver === driver.id}
              />
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
