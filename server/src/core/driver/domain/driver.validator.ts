import { z } from 'zod';

import { ClassValidatorFields } from '../../../shared/domain/validators';

const carSchema = z.object({
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
  color: z
    .string({ message: 'Car color is required' })
    .min(1, { message: 'Car color must be at least 1 character' })
    .max(255, { message: 'Car color must be at most 255 characters' }),
  observations: z
    .string()
    .min(1, { message: 'Car observations must be at least 1 character' })
    .max(255, { message: 'Car observations must be at most 255 characters' })
    .nullable()
    .optional(),
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
    car: carSchema,
    rating: z
      .number({ message: 'Driver rating should be a number' })
      .int({ message: 'Driver rating should be an integer' })
      .gte(0, { message: 'Driver rating should be a positive number' })
      .max(5, { message: 'Driver rating should be at most 5' }),
    fee_by_km: z
      .number({ message: 'Driver fee by km should be a number' })
      .int({ message: 'Driver fee by km should be an integer' })
      .positive({ message: 'Driver fee by km should be a positive number' })
      .gt(0, { message: 'Driver fee by km should be greater than 0' }),
    minimum_km: z
      .number({ message: 'Driver minimum km should be a number' })
      .int({ message: 'Driver minimum km should be an integer' })
      .positive({ message: 'Driver minimum km should be a positive number' }),
  });
}
