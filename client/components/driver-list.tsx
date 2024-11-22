"use client";

import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const drivers = [
  { id: 1, name: "John Doe", car: "Toyota Camry", rating: 4.8 },
  { id: 2, name: "Jane Smith", car: "Honda Civic", rating: 4.9 },
  { id: 3, name: "Mike Johnson", car: "Ford Fusion", rating: 4.7 },
];

interface DriverListProps {
  className?: string;
}

export function DriverList({ className }: DriverListProps) {
  return (
    <div
      className={`${className} bg-background text-foreground p-6 rounded-lg`}
    >
      <h2 className="text-xl font-semibold mb-4">Available Drivers</h2>
      <ul className="space-y-4">
        {drivers.map((driver) => (
          <li
            key={driver.id}
            className="bg-card dark:bg-card-dark shadow rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Car size={24} />
                <div>
                  <h3 className="font-semibold">{driver.name}</h3>
                  <p className="text-sm text-muted-foreground">{driver.car}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{driver.rating} ⭐</p>
                <Button size="sm" className="mt-2">
                  Select
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
