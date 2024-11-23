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
