import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @ApiProperty()
  @IsString()
  public first_name?: string;

  @ApiProperty()
  @IsString()
  public last_name?: string;
}
