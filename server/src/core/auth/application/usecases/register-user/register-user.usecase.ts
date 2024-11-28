import { IUsecase } from '../../../../../shared/application';
import { AuthService, AuthUser, LoginResponse } from '../../../domain/services';

export type RegisterUserInput = AuthUser;

export type RegisterUserOutput = LoginResponse;

export class RegisterUserUsecase
  implements IUsecase<RegisterUserInput, RegisterUserOutput>
{
  constructor(private readonly authService: AuthService) {}

  public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    await this.authService.register(input);
    return this.authService.login({
      emailOrUsername: input.email,
      password: input.password,
    });
  }
}
