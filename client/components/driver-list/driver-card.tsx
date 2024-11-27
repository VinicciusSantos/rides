import { EstimatedDriver } from "@/services/ride.service";
import { Car, Info, Star } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { SelectDriver } from "./select-driver";

interface DriverCardProps {
  driver: EstimatedDriver;
}

export function DriverCard({ driver }: DriverCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="flex flex-col space-y-4">
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
            <p className="text-lg font-semibold flex items-center justify-end">
              {driver.value ? `$${driver.value.toFixed(2)}` : "N/A"}
            </p>
            <p className="text-muted-foreground flex items-center justify-end">
              <Star className="mr-1" size={16} />
              {driver.review?.rating.toFixed(1) || "N/A"}
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
            <p className="text-muted-foreground">{driver.review.comment}</p>
          </div>
        )}

        <SelectDriver className="self-end" driver={driver} />
      </CardContent>
    </Card>
  );
}
