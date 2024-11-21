import { Controller, Get, Inject } from '@nestjs/common';

import { EstimateRideUsecase } from '../../core/ride/application/usecases';

@Controller('ride')
export class RideController {
  constructor(
    @Inject(EstimateRideUsecase)
    private readonly estimateRideUsecase: EstimateRideUsecase,
  ) {}

  @Get('estimate')
  public async estimateRide() {
    await this.estimateRideUsecase.execute({
      customer_id: '1',
      origin: 'Rua Maria Aurora da conceição',
      destination: 'Rua São Pedro, juazeiro do norte',
    });
  }
}
