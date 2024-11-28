import { IUsecase } from '../../../../../shared/application';
import { AuthService } from '../../../domain/services';

export interface LogourInput {
  refresh_token: string;
}

export type LogoutOutput = void;

export class LogoutUsecase implements IUsecase<LogourInput, LogoutOutput> {
  constructor(private readonly authService: AuthService) {}

  public async execute(input: LogourInput): Promise<void> {
    return this.authService.logout(input.refresh_token);
  }
}
