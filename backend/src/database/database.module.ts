import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        }),
        MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>(
            'MONGO_URI', 'mongodb://localhost:27017/redsocial'
            ),
        }),
        inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
