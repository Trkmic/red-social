import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginLog, LoginLogDocument } from './login-log.schema';
import { LikeLog, LikeLogDocument } from './like-log.schema';
import { ProfileViewLog, ProfileViewLogDocument } from './profile-view-log.schema';

@Injectable()
export class LogsService {
    constructor(
        @InjectModel(LoginLog.name) private loginLogModel: Model<LoginLogDocument>,
        @InjectModel(LikeLog.name) private likeLogModel: Model<LikeLogDocument>,
        @InjectModel(ProfileViewLog.name) private profileViewLogModel: Model<ProfileViewLogDocument>,
    ) {}

    async logLogin(usuarioId: string) {
        await this.loginLogModel.create({ usuarioId });
    }

    async logLike(usuarioId: string, publicacionId: string) {
        await this.likeLogModel.create({ usuarioId, publicacionId });
    }

    async logProfileView(viewerId: string, profileOwnerId: string) {
        if (viewerId !== profileOwnerId) {
            await this.profileViewLogModel.create({ viewerId, profileOwnerId });
        }
    }
}