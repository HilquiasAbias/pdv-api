import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EncryptionService } from 'src/providers/encryption.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(data: any) {
    let payload: any = this.encryptionService.decrypt(data.sub);
    payload = JSON.parse(payload);
    
    const user = await this.usersService.getForLogin(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}