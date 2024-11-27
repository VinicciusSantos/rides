import { fetcher } from "@/lib/fetcher";
import { Driver } from "./driver.service";

export interface EstimateRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface EstimateRideResponse {
  origin: GeolocationJSON;
  destination: GeolocationJSON;
  distance: number;
  duration: string;
  options: EstimatedDriver[];
  routeResponse: {
    distanceMeters: number;
    duration: string;
    polyline: {
      encodedPolyline: string;
    };
  };
}

export interface GeolocationJSON {
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface EstimatedDriver {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: { rating: number; comment: string };
  value: number;
}

export interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export interface ConfirmRideResponse {
  success?: boolean;
}

export interface Ride {
  ride_id: string;
  customer_id: string;
  origin: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: number;
  duration: string;
  driver_id: number;
  driver: Driver;
  value: number;
  encoded_polyline: string;
}

export interface RidesResponse {
  items: Ride[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export const estimateRide = async (
  data: EstimateRideRequest
): Promise<EstimateRideResponse> =>
  fetcher("/ride/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const confirmRide = async (
  data: ConfirmRideRequest
): Promise<ConfirmRideResponse> =>
  fetcher("/ride/confirm", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const fetchRides = async (
  data: { customer_id?: string; driver_id?: string } = {}
): Promise<RidesResponse> => {
  const params = new URLSearchParams(data as Record<string, string>).toString();
  return fetcher<RidesResponse>(`/ride/all?${params}`, {
    method: "GET",
    next: { tags: ["allRides"] },
  });
};
