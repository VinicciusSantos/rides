import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  LoginWithCredentialsUsecase,
  LogoutUsecase,
  RegisterUserUsecase,
} from '../../core/auth/application/usecases';
import { AuthController } from './auth.controller';
import { LoginWithCredentialsDto, LogoutDto, RegisterUserDto } from './dtos';

const AUTH_TESTING_MODULE: ModuleMetadata = {
  controllers: [AuthController],
  providers: [
    { provide: LoginWithCredentialsUsecase, useValue: { execute: jest.fn() } },
    { provide: LogoutUsecase, useValue: { execute: jest.fn() } },
    { provide: RegisterUserUsecase, useValue: { execute: jest.fn() } },
  ],
};

describe('AuthController', () => {
  let authController: AuthController;
  let loginWithCredentialsUsecase: jest.Mocked<LoginWithCredentialsUsecase>;
  let logoutUsecase: jest.Mocked<LogoutUsecase>;
  let registerUserUsecase: jest.Mocked<RegisterUserUsecase>;

  beforeEach(async () => {
    const module =
      await Test.createTestingModule(AUTH_TESTING_MODULE).compile();

    authController = module.get<AuthController>(AuthController);
    loginWithCredentialsUsecase = module.get(LoginWithCredentialsUsecase);
    logoutUsecase = module.get(LogoutUsecase);
    registerUserUsecase = module.get(RegisterUserUsecase);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call loginWithCredentialsUsecase with correct dto', async () => {
      const loginDto: LoginWithCredentialsDto = {
        email_or_username: 'testuser',
        password: 'testpassword',
      };
      await authController.login(loginDto);

      expect(loginWithCredentialsUsecase.execute).toHaveBeenCalledWith({
        emailOrUsername: loginDto.email_or_username,
        password: loginDto.password,
      });
      expect(loginWithCredentialsUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should call logoutUsecase with correct dto', async () => {
      const logoutDto: LogoutDto = { refresh_token: 'test-refresh-token' };
      await authController.logout(logoutDto);

      expect(logoutUsecase.execute).toHaveBeenCalledWith(logoutDto);
      expect(logoutUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('register', () => {
    it('should call registerUserUsecase with correct dto', async () => {
      const registerDto: RegisterUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };
      await authController.register(registerDto);

      expect(registerUserUsecase.execute).toHaveBeenCalledWith(registerDto);
      expect(registerUserUsecase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
