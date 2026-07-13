import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../crypto/hashPassword';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

const GUEST_ADJECTIVES = [
  'bright', 'calm', 'brave', 'swift', 'merry', 'cosmic',
  'lucky', 'mellow', 'sunny', 'quiet', 'bold', 'witty',
];
const GUEST_ANIMALS = [
  'otter', 'fox', 'lynx', 'panda', 'falcon', 'koala',
  'dolphin', 'badger', 'heron', 'tiger', 'yak', 'marmot',
];

/** Readable throwaway identity, e.g. "bright-otter-42". */
function generateGuestName(): string {
  const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${pick(GUEST_ADJECTIVES)}-${pick(GUEST_ANIMALS)}-${num}`;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Login already exists');
      }
      throw error;
    }
  }

  /**
   * Issues a throwaway identity so visitors can join rooms from a shared
   * link without registering. No DB row: the JWT itself is the identity —
   * room code already falls back to the login for display names. No
   * refresh token either; when the session expires, the guest re-joins.
   */
  async guest() {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_KEY must be set');
    }

    const payload = {
      userId: `guest-${randomUUID()}`,
      login: generateGuestName(),
      roles: ['guest'],
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: (process.env.TOKEN_GUEST_EXPIRE_TIME || '12h') as any,
    });

    return { accessToken, refreshToken: '' };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getByLogin(dto.login);
    if (!user || !(await comparePassword(dto.password, user.password))) {
      throw new ForbiddenException('Incorrect login or password');
    }
    const roles = user.roles || ['user'];
    return this.generateTokens(user.id, user.login, roles);
  }

  private async generateTokens(
    userId: string,
    login: string,
    roles: string[] = ['user'],
  ) {
    const payload = { userId, login, roles };
    const secret = process.env.JWT_SECRET_KEY;
    const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;

    if (!secret || !refreshSecret) {
      throw new Error('JWT_SECRET_KEY and JWT_SECRET_REFRESH_KEY must be set');
    }

    const accessExpiry: string = process.env.TOKEN_EXPIRE_TIME || '1h';
    const refreshExpiry: string = process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: accessExpiry as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiry as any,
    });

    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshDto) {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    const refreshSecret = process.env.JWT_SECRET_REFRESH_KEY;
    if (!refreshSecret) {
      throw new Error('JWT_SECRET_REFRESH_KEY must be set');
    }
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: refreshSecret,
      });
      const user = await this.userService.getByLogin(payload.login);
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      const roles = user.roles || ['user'];
      return this.generateTokens(user.id, user.login, roles);
    } catch (e: any) {
      if (e instanceof ForbiddenException) throw e;
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
