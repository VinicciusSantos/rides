import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { GetDriversUsecase } from '../../core/driver/application/usecases';

@Controller('driver')
export class DriverController {
  constructor(
    @Inject(GetDriversUsecase)
    private readonly getDriversUsecase: GetDriversUsecase,
  ) {}

  @Get('all')
  @ApiQuery({ name: 'min_km_lte', required: false, type: Number })
  @ApiQuery({ name: 'driver_id', required: false, type: Number })
  public async getDrivers(
    @Query('min_km_lte') minKmLte?: number,
    @Query('driver_id') driverId?: number,
  ) {
    return this.getDriversUsecase.execute({
      min_km_lte: minKmLte,
      driver_id: driverId,
    });
  }
}
