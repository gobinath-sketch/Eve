import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Admin } from '../../../entities/admin.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

function extractJwtFromCookieOrHeader(req: Request): string | null {
  if (req?.cookies?.access_token) {
    return req.cookies.access_token as string;
  }
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { id: payload.sub } });
    if (!admin) {
      throw new UnauthorizedException('Invalid token');
    }
    return admin;
  }
}
