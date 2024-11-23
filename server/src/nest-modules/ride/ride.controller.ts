import { Body, Controller, Inject, Patch, Post } from '@nestjs/common';

import {
  ConfirmRideUsecase,
  EstimateRideUsecase,
} from '../../core/ride/application/usecases';
import { EstimateRideDto } from './dtos';

@Controller('ride')
export class RideController {
  constructor(
    @Inject(EstimateRideUsecase)
    private readonly estimateRideUsecase: EstimateRideUsecase,

    @Inject(ConfirmRideUsecase)
    private readonly confirmRideUsecase: ConfirmRideUsecase,
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

  @Patch('confirm')
  public async confirmRide() {
    const response = await this.confirmRideUsecase.execute({
      customer_id: '1',
      origin: 'A',
      destination: 'B',
      distance: 10,
      duration: '10min',
      driver: {
        id: 1,
        name: 'John Doe',
      },
      value: 100,
    });
    console.log("🚀 ~ RideController ~ confirmRide ~ response:", response)
    return response;
  }
}
