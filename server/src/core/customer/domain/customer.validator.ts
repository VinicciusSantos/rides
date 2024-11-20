import { z } from 'zod';

import { ClassValidatorFields } from '../../../shared/domain/validators';

export class CustomerValidator extends ClassValidatorFields {
  public schema = z.object({
    customer_id: z.object(
      { id: z.string().uuid() },
      { message: 'Customer ID should be a valid CustomerId' },
    ),
    name: z
      .string({ message: 'Customer name should be a string' })
      .min(1, { message: 'Customer name must be at least 1 character' })
      .max(255, { message: 'Customer name must be at most 255 characters' }),
  });
}
