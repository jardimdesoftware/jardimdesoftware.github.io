import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/application/services/auth/auth.service';
import {
  IAdminUserRepository as IAdminUserRepositorySymbol,
  type IAdminUserRepository,
} from '@/domain/repositories/admin-user.repository';
import {
  IHashService as IHashServiceSymbol,
  type IHashService,
} from '@/application/ports/hash.service';
import { AdminUserEntity } from '@/domain/entities/admin-user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let adminUserRepository: jest.Mocked<IAdminUserRepository>;
  let hashService: jest.Mocked<IHashService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockAdmin = new AdminUserEntity({
    id: 1,
    email: 'admin@jardimdesoftware.local',
    password: 'hashedPassword',
    name: 'Administrador',
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IAdminUserRepositorySymbol,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: IHashServiceSymbol,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    adminUserRepository = module.get(IAdminUserRepositorySymbol);
    hashService = module.get(IHashServiceSymbol);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar accessToken e dados do admin quando credenciais são válidas', async () => {
      adminUserRepository.findByEmail.mockResolvedValue(mockAdmin);
      hashService.compare.mockResolvedValue(true);
      adminUserRepository.update.mockResolvedValue({
        ...mockAdmin,
        lastLogin: new Date(),
      });
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({
        email: 'admin@jardimdesoftware.local',
        password: 'ChangeMe123!',
      });

      expect(adminUserRepository.findByEmail).toHaveBeenCalledWith(
        'admin@jardimdesoftware.local',
      );
      expect(hashService.compare).toHaveBeenCalledWith(
        'ChangeMe123!',
        'hashedPassword',
      );
      expect(adminUserRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ lastLogin: expect.any(Date) }),
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'admin@jardimdesoftware.local',
      });
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'admin@jardimdesoftware.local',
          name: 'Administrador',
        },
      });
    });

    it('deve lançar UnauthorizedException quando o email não for encontrado', async () => {
      adminUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'naoexiste@jardimdesoftware.local',
          password: 'ChangeMe123!',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(hashService.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('deve lançar UnauthorizedException quando a senha estiver incorreta', async () => {
      adminUserRepository.findByEmail.mockResolvedValue(mockAdmin);
      hashService.compare.mockResolvedValue(false);

      await expect(
        service.login({
          email: 'admin@jardimdesoftware.local',
          password: 'senhaErrada',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(adminUserRepository.update).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
