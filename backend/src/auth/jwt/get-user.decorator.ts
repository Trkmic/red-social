import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // JwtStrategy debe haber adjuntado el objeto user (con _id, nombreUsuario, perfil, etc.) a la request
        return request.user;
    },
);