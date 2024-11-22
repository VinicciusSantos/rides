"use client";

import { Car, Star, DollarSign, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstimatedDriver } from "@/services/ride.service";

interface DriverListProps {
  className?: string;
  drivers: EstimatedDriver[];
}

export function DriverList({ className, drivers }: DriverListProps) {
  return (
    <div
      className={`${className} bg-background text-foreground p-6 rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">Available Drivers</h2>
      <ul className="space-y-6">
        {drivers.map((driver) => (
          <li
            key={driver.id}
            className="bg-card dark:bg-card-dark shadow rounded-lg p-6 transition-colors"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Car size={24} />
                  <div>
                    <h3 className="font-semibold">{driver.name || "N/A"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {driver.vehicle || "Vehicle information not available"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold flex items-center justify-end">
                    <Star className="mr-1" size={16} />
                    {driver.review?.rating || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center justify-end">
                    <DollarSign className="mr-1" size={16} />
                    {driver.value ? `$${driver.value.toFixed(2)}` : "N/A"}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <h4 className="font-semibold mb-1 flex items-center">
                  <Info className="mr-2" size={16} />
                  Description
                </h4>
                <p className="text-muted-foreground">
                  {driver.description || "No description available"}
                </p>
              </div>

              {driver.review?.comment && (
                <div className="text-sm">
                  <h4 className="font-semibold mb-1 flex items-center">
                    <Star className="mr-2" size={16} />
                    Review
                  </h4>
                  <p className="text-muted-foreground">
                    {driver.review.comment}
                  </p>
                </div>
              )}

              <Button size="sm" className="self-end">
                Select
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
