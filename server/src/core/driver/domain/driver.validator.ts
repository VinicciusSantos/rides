import { z } from 'zod';

import { ClassValidatorFields } from '../../../shared/domain/validators';

const vehicleSchema = z.object({
  model: z
    .string({ message: 'Car model is required' })
    .min(1, { message: 'Car model must be at least 1 character' })
    .max(255, { message: 'Car model must be at most 255 characters' }),
  brand: z
    .string({ message: 'Car brand is required' })
    .min(1, { message: 'Car brand must be at least 1 character' })
    .max(255, { message: 'Car brand must be at most 255 characters' }),
  year: z
    .number({ message: 'Car year must be a number' })
    .int({ message: 'Car year must be an integer' })
    .min(1886, { message: 'The first car was made in 1886 by Karl Benz' })
    .max(new Date().getFullYear() + 1, {
      message: 'Car year must be at most the current year',
    }),
  description: z
    .string()
    .max(255, { message: 'Car description must be at most 255 characters' })
    .nullable()
    .optional(),
});

const reviewSchema = z.object({
  rating: z
    .number({ message: 'Review rating should be a number' })
    .int({ message: 'Review rating should be an integer' })
    .min(1, { message: 'Review rating should be at least 1' })
    .max(5, { message: 'Review rating should be at most 5' }),
  comment: z
    .string({ message: 'Review comment should be a string' })
    .max(255, { message: 'Review comment must be at most 255 characters' }),
});

export class DriverValidator extends ClassValidatorFields {
  public schema = z.object({
    name: z
      .string({ message: 'Driver name should be a string' })
      .min(1, { message: 'Driver name must be at least 1 character' })
      .max(255, { message: 'Driver name must be at most 255 characters' }),
    description: z
      .string({ message: 'Driver description should be a string' })
      .min(1, { message: 'Driver description must be at least 1 character' })
      .max(255, {
        message: 'Driver description must be at most 255 characters',
      }),
    vehicle: vehicleSchema,
    review: reviewSchema,
    fee_by_km: z
      .number({ message: 'Driver fee by km should be a number' })
      .positive({ message: 'Driver fee by km should be a positive number' })
      .gt(0, { message: 'Driver fee by km should be greater than 0' }),
    minimum_km: z
      .number({ message: 'Driver minimum km should be a number' })
      .positive({ message: 'Driver minimum km should be a positive number' }),
  });
}
