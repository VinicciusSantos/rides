import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';

import {
  ConfirmRideUsecase,
  EstimateRideUsecase,
  GetRidesUsecase,
} from '../../core/ride/application/usecases';
import {
  ConfirmRideDto,
  EstimateRideDto,
  EstimateRideResponseDto,
} from './dtos';

@Controller('ride')
export class RideController {
  constructor(
    @Inject(GetRidesUsecase)
    private readonly getRidesUsecase: GetRidesUsecase,

    @Inject(EstimateRideUsecase)
    private readonly estimateRideUsecase: EstimateRideUsecase,

    @Inject(ConfirmRideUsecase)
    private readonly confirmRideUsecase: ConfirmRideUsecase,
  ) {}

  @Get('all')
  @ApiQuery({ name: 'customer_id', required: false, type: String })
  @ApiQuery({ name: 'driver_id', required: false, type: Number })
  public async getRides(
    @Query('customer_id') customerId?: string,
    @Query('driver_id') driverId?: string,
  ) {
    return this.getRidesUsecase.execute({
      customer_id: customerId,
      driver_id: driverId ? parseInt(driverId) : undefined,
    });
  }

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
    await this.confirmRideUsecase.execute({
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
    return { success: true };
  }
}
