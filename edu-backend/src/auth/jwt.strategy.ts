import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'eto_moi_secret_key_i_mne_poh', // также используйте переменные окружения
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      return null;
    }
    return user;
  }
}
