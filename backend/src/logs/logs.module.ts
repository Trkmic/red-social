import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLog, LoginLogSchema } from './login-log.schema';
import { LikeLog, LikeLogSchema } from './like-log.schema';
import { ProfileViewLog, ProfileViewLogSchema } from './profile-view-log.schema';
import { LogsService } from './logs.service';

@Module({
    imports: [
        MongooseModule.forFeature([
        { name: LoginLog.name, schema: LoginLogSchema },
        { name: LikeLog.name, schema: LikeLogSchema },
        { name: ProfileViewLog.name, schema: ProfileViewLogSchema },
        ]),
    ],
    providers: [LogsService],
    exports: [LogsService],
})
export class LogsModule {}