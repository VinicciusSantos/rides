import { IUsecase } from '../../../../../shared/application';
import { AuthService, AuthUser } from '../../../domain/services';

export type RegisterUserInput = AuthUser;

export type RegisterUserOutput = void;

export class RegisterUserUsecase
  implements IUsecase<RegisterUserInput, RegisterUserOutput>
{
  constructor(private readonly authService: AuthService) {}

  public async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    return this.authService.register(input);
  }
}
