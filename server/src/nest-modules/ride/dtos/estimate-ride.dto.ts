import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EstimateRideDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public origin!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public destination!: string;
}

class GeolocationDto {
  @ApiProperty({ example: -23.5505 })
  public latitude!: number;

  @ApiProperty({ example: -46.6333 })
  public longitude!: number;
}

class ReviewDto {
  @ApiProperty({ example: 4.5 })
  public rating!: number;

  @ApiProperty({ example: 'Great service!' })
  public comment!: string;
}

class RideOptionDto {
  @ApiProperty({ example: 1 })
  public id!: number;

  @ApiProperty({ example: 'Homer Simpson' })
  public name!: string;

  @ApiProperty({ example: 'Simpsons Taxi' })
  public description!: string;

  @ApiProperty({ example: 'Pink car' })
  public vehicle!: string;

  @ApiProperty({ type: ReviewDto })
  public review!: ReviewDto;

  @ApiProperty({ example: 25.5 })
  public value!: number;
}

export class EstimateRideResponseDto {
  @ApiProperty({ type: GeolocationDto })
  public origin!: GeolocationDto;

  @ApiProperty({ type: GeolocationDto })
  public destination!: GeolocationDto;

  @ApiProperty({ example: 15.2 })
  public distance!: number;

  @ApiProperty({ example: '1225s' })
  public duration!: string;

  @ApiProperty({ type: [RideOptionDto] })
  public options!: RideOptionDto[];

  @ApiProperty({ example: {} })
  public routeResponse!: unknown;
}
