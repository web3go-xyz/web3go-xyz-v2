import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthorizedUser } from '../AuthorizedUser';
import { IAuthService } from '../IAuthService';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject('LOCAL_AUTH_SERVICE') private readonly authService: IAuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<AuthorizedUser> {
        if (this.authService) {
            // console.log(this.authService);

            return this.authService.validateUser({
                id: username, name: username,
                secret: password
            });
        }
        else {
            throw new NotFoundException('authService is null');
        }


    }
}

