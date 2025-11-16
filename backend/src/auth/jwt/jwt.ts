import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET') || 'SECRET_KEY',
        });
    }

    async validate(payload: any) {
        // El payload es el objeto de usuario guardado en el token
        return { 
            _id: payload.sub, 
            nombreUsuario: payload.nombreUsuario, 
            email: payload.email,
            rol: payload.rol 
        };
    }
}
