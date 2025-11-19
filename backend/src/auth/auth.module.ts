import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt';
import { UsuariosController } from './usuarios.controller'; 
import { AdminGuard } from './admin.guard'; 
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'SECRET_KEY',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    CloudinaryModule, // <<-- Importamos el módulo que provee CloudinaryService
  ],
  controllers: [AuthController],
  // Eliminamos CloudinaryService de providers, ya que viene de CloudinaryModule
  providers: [AuthService, JwtStrategy], 
  // Exportamos AuthService para que UsuariosModule pueda usarlo
  exports: [MongooseModule, AuthService] 
})
export class AuthModule {}