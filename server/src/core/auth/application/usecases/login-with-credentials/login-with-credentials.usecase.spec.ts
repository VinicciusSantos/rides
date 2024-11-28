import { AuthService, LoginResponse } from '../../../domain/services';
import { LoginWithCredentialsUsecase } from './login-with-credentials.usecase';

describe('LoginWithCredentialsUsecase', () => {
  let usecase: LoginWithCredentialsUsecase;
  let authService: jest.Mocked<AuthService>;

  const mockInput = {
    emailOrUsername: 'testuser',
    password: 'testpassword',
  };

  const mockResponse: LoginResponse = {
    access_token: 'access_token',
  } as LoginResponse;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    usecase = new LoginWithCredentialsUsecase(authService);
  });

  it('should login successfully with valid credentials', async () => {
    authService.login.mockResolvedValue(mockResponse);

    const result = await usecase.execute(mockInput);

    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith({
      emailOrUsername: mockInput.emailOrUsername,
      password: mockInput.password,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if login fails', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    await expect(usecase.execute(mockInput)).rejects.toThrow(
      'Invalid credentials',
    );
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith({
      emailOrUsername: mockInput.emailOrUsername,
      password: mockInput.password,
    });
  });
});
