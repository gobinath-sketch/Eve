import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Admin } from '../../entities/admin.entity';
import { LoginHistory } from '../../entities/login-history.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { getClientIp, getUserAgent } from '../../common/utils/request-metadata.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    @InjectRepository(LoginHistory)
    private readonly loginHistoryRepo: Repository<LoginHistory>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto, req: Request, res: Response) {
    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);

    const admin = await this.adminRepo.findOne({ where: { email: dto.email } });

    if (!admin) {
      await this.logLogin(null, ip, userAgent, false);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) {
      await this.logLogin(admin.id, ip, userAgent, false);
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.logLogin(admin.id, ip, userAgent, true);

    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    const token = this.jwtService.sign(payload);

    const isProduction = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      admin: { id: admin.id, email: admin.email, role: admin.role },
      accessToken: token,
    };
  }

  logout(res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  me(admin: Admin) {
    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  }

  private async logLogin(
    adminId: string | null,
    ip: string,
    userAgent: string,
    success: boolean,
  ) {
    await this.loginHistoryRepo.save({
      adminId: adminId ?? undefined,
      ipAddress: ip,
      userAgent,
      success,
    });
  }
}
