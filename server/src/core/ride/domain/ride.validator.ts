import { z } from 'zod';

import { ClassValidatorFields } from '../../../shared/domain/validators';

export class RideValidator extends ClassValidatorFields {
  protected schema = z.object({
    ride_id: z.object(
      { id: z.string().uuid() },
      { message: 'Ride ID should be a valid RiderId' },
    ),
    customer_id: z.object(
      { id: z.string().uuid() },
      { message: 'Customer ID should be a valid CustomerId' },
    ),
    driver_id: z.object({
      id: z
        .number()
        .positive({ message: 'Driver ID should be a positive number' }),
    }),
    origin: z.object(
      {
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
      },
      { message: 'Origin should be a valid Geolocation' },
    ),
    destination: z.object(
      {
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
      },
      { message: 'Destination should be a valid Geolocation' },
    ),
    distance: z
      .number()
      .positive({ message: 'Distance should be a positive number' }),
    duration: z.string(),
    value: z
      .number()
      .positive({ message: 'Value should be a positive number' }),
    encoded_polyline: z.string(),
  });
}
