import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import {
  ConfirmRideUsecase,
  EstimateRideUsecase,
} from '../../core/ride/application/usecases';
import {
  ConfirmRideDto,
  EstimateRideDto,
  EstimateRideResponseDto,
} from './dtos';

@Controller('ride')
export class RideController {
  constructor(
    @Inject(EstimateRideUsecase)
    private readonly estimateRideUsecase: EstimateRideUsecase,

    @Inject(ConfirmRideUsecase)
    private readonly confirmRideUsecase: ConfirmRideUsecase,
  ) {}

  @Post('estimate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Operation completed successfully',
    type: EstimateRideResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The data provided in the request body is invalid',
    schema: {
      type: 'object',
      properties: {
        error_code: { type: 'string', example: 'INVALID_DATA' },
        error_description: { type: 'string' },
      },
    },
  })
  public async estimateRide(@Body() body: EstimateRideDto) {
    const response = await this.estimateRideUsecase.execute({
      customer_id: '1',
      origin: body.origin,
      destination: body.destination,
    });
    return response;
  }

  @Patch('confirm')
  public async confirmRide(@Body() body: ConfirmRideDto) {
    const response = await this.confirmRideUsecase.execute({
      customer_id: body.customer_id,
      origin: body.origin,
      destination: body.destination,
      distance: body.distance,
      duration: body.duration,
      driver: {
        id: body.driver.id,
        name: body.driver.name,
      },
      value: body.value,
    });
    return response;
  }
}
