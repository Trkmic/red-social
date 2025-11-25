import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ✅ CORRECCIÓN: Importación de las clases faltantes
import { LogsModule } from '../logs/logs.module';

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
    CloudinaryModule,
    LogsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [MongooseModule, AuthService] 
})
export class AuthModule {}