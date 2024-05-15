import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { GiftogetherExceptions } from 'src/filters/giftogether-exception';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User])],
  controllers: [FriendController],
  providers: [FriendService, GiftogetherExceptions],
})
export class FriendModule {}
