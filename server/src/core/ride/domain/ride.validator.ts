import { z } from 'zod';

import { ClassValidatorFields } from '../../../shared/domain/validators';

export class RideValidator extends ClassValidatorFields {
  protected schema = z.object({});
}
