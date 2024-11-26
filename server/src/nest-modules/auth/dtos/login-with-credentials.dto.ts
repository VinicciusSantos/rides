import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginWithCredentialsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public email_or_username!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password!: string;
}
