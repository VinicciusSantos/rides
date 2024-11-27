import { AuthService } from '../../../domain/services';
import { LogoutUsecase } from './logout.usecase';

describe('LogoutUsecase', () => {
  let usecase: LogoutUsecase;
  let authService: jest.Mocked<AuthService>;

  const mockInput = {
    refresh_token: 'test-refresh-token',
  };

  beforeEach(() => {
    authService = {
      logout: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    usecase = new LogoutUsecase(authService);
  });

  it('should logout successfully with valid refresh token', async () => {
    await usecase.execute(mockInput);

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(authService.logout).toHaveBeenCalledWith(mockInput.refresh_token);
  });

  it('should throw an error if logout fails', async () => {
    authService.logout.mockRejectedValue(new Error('Logout failed'));

    await expect(usecase.execute(mockInput)).rejects.toThrow('Logout failed');
    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(authService.logout).toHaveBeenCalledWith(mockInput.refresh_token);
  });
});
