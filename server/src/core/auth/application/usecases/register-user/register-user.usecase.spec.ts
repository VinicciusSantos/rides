import { AuthService, AuthUser } from '../../../domain/services';
import { RegisterUserUsecase } from './register-user.usecase';

describe('RegisterUserUsecase', () => {
  let usecase: RegisterUserUsecase;
  let authService: jest.Mocked<AuthService>;

  const mockInput: AuthUser = {
    username: 'newuser',
    password: 'newpassword',
    email: 'newuser@example.com',
  };

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    usecase = new RegisterUserUsecase(authService);
  });

  it('should register a user successfully with valid input', async () => {
    await usecase.execute(mockInput);

    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toHaveBeenCalledWith(mockInput);
  });

  it('should throw an error if registration fails', async () => {
    authService.register.mockRejectedValue(new Error('Registration failed'));

    await expect(usecase.execute(mockInput)).rejects.toThrow(
      'Registration failed',
    );
    expect(authService.register).toHaveBeenCalledTimes(1);
    expect(authService.register).toHaveBeenCalledWith(mockInput);
  });
});
