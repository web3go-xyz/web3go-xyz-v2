import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import JWTConfig from './config';
import { AuthUser } from './authUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWTConfig.secret,
        });
    }

    async validate(payload: any): Promise<AuthUser> {
        //console.log('JwtStrategy payload:', payload);

        return { ...payload, id: payload.id || payload.sub || '', name: payload.name || payload.first_name || '' };
    }
}
