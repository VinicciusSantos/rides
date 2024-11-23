import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class DriverDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public id!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name!: string;
}

export class ConfirmRideDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public customer_id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public origin!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public destination!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public distance!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public duration!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public value!: number;

  @ApiProperty({ type: DriverDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DriverDto)
  public driver!: DriverDto;
}
