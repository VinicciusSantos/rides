import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import {
  LoginWithCredentialsUsecase,
  LogoutUsecase,
  RegisterUserUsecase,
} from '../../core/auth/application/usecases';
import { LoginWithCredentialsDto, LogoutDto, RegisterUserDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginWithCredentialsUsecase)
    private readonly loginWithCredentialsUsecase: LoginWithCredentialsUsecase,

    @Inject(LogoutUsecase)
    private readonly logoutUsecase: LogoutUsecase,

    @Inject(RegisterUserUsecase)
    private readonly registerUserUsecase: RegisterUserUsecase,
  ) {}

  @Post('login/credentials')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        expires_in: { type: 'string' },
        refresh_expires_in: { type: 'number' },
        refresh_token: { type: 'string' },
        token_type: { type: 'string' },
        'not-before-policy': { type: 'number' },
        session_state: { type: 'string' },
        scope: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  public async login(@Body() body: LoginWithCredentialsDto) {
    return this.loginWithCredentialsUsecase.execute({
      emailOrUsername: body.email_or_username,
      password: body.password,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  public async logout(@Body() body: LogoutDto) {
    return this.logoutUsecase.execute({
      refresh_token: body.refresh_token,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User registered' })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string' },
        statusCode: { default: HttpStatus.UNPROCESSABLE_ENTITY },
      },
    },
  })
  public async register(@Body() body: RegisterUserDto) {
    return this.registerUserUsecase.execute({
      email: body.email,
      password: body.password,
      username: body.username,
      firstName: body.first_name,
      lastName: body.last_name,
    });
  }
}
