import { IUserRepository } from '@domain/repositories/IUserRepository';
import { PasswordHasher } from '@infrastructure/security/PasswordHasher';
import { JwtService } from '@infrastructure/security/JwtService';
import { AuthResponse } from './Register';

export interface LoginDTO {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: PasswordHasher,
    private jwtService: JwtService
  ) {}

  async execute(dto: LoginDTO): Promise<AuthResponse> {
    // Buscar usuário
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar senha
    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Gerar tokens
    const accessToken = this.jwtService.generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = this.jwtService.generateRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
}