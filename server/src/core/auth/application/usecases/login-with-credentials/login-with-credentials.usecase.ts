import { IUsecase } from '../../../../../shared/application';
import { AuthService, LoginResponse } from '../../../domain/services';

export interface LoginWithCredentialsInput {
  emailOrUsername: string;
  password: string;
}

export type LoginWithCredentialsOutput = LoginResponse;

export class LoginWithCredentialsUsecase
  implements IUsecase<LoginWithCredentialsInput, LoginWithCredentialsOutput>
{
  constructor(private readonly authService: AuthService) {}

  public async execute(
    input: LoginWithCredentialsInput,
  ): Promise<LoginWithCredentialsOutput> {
    return this.authService.login({
      emailOrUsername: input.emailOrUsername,
      password: input.password,
    });
  }
}
