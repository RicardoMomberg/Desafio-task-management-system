import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { PasswordHasher } from '@infrastructure/security/PasswordHasher';
import { JwtService } from '@infrastructure/security/JwtService';
import { randomUUID } from 'crypto';

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: PasswordHasher,
    private jwtService: JwtService
  ) {}

  async execute(dto: RegisterDTO): Promise<AuthResponse> {
    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Validar senha
    if (dto.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Hash da senha
    const passwordHash = await this.passwordHasher.hash(dto.password);

    // Criar usuário
    const user = new User(
      randomUUID(),
      dto.email,
      passwordHash,
      dto.name,
      new Date(),
      new Date()
    );

    await this.userRepository.create(user);

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