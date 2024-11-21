import { Body, Controller, Inject, Post } from '@nestjs/common';

import { EstimateRideUsecase } from '../../core/ride/application/usecases';
import { EstimateRideDto } from './dtos';

@Controller('ride')
export class RideController {
  constructor(
    @Inject(EstimateRideUsecase)
    private readonly estimateRideUsecase: EstimateRideUsecase,
  ) {}

  @Post('estimate')
  public async estimateRide(@Body() body: EstimateRideDto) {
    const response = await this.estimateRideUsecase.execute({
      customer_id: '1',
      origin: body.origin,
      destination: body.destination,
    });
    return response;
  }
}
