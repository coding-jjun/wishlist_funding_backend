import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/entities/friend.entity';
import { User } from 'src/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { FriendDto } from './dto/friend.dto';
import { FriendStatus } from 'src/enums/friend-status.enum';
import {
  GiftogetherExceptions
} from 'src/filters/giftogether-exception';
import { ImageType } from 'src/enums/image-type.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotiType } from 'src/enums/noti-type.enum';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
    private readonly g2gException: GiftogetherExceptions,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * 친구 목록 조회
   * @param userId
   */
  async getFriends(userId: number): Promise<{ result: any[]; total: number }> {
    // const user = await this.userRepository.findOne({ where: { userId }});
    // if (!user) {
    // 	throw new HttpException('존재하지 않는 사용자입니다.', HttpStatus.BAD_REQUEST);
    // }

    const friendIds = await this.friendRepository
      .createQueryBuilder('friend')
      .where('friend.status = :status', { status: FriendStatus.Friend })
      .andWhere(
        new Brackets((qb) => {
          qb.where('friend.userId = :userId', { userId }).orWhere(
            'friend.friendId = :userId',
            { userId },
          );
        }),
      )
      .select(
        'CASE WHEN friend.userId = :userId THEN friend.friendId ELSE friend.userId END',
        'friendId',
      )
      .setParameter('userId', userId)
      .getRawMany();

    // 친구 정보 및 이미지 URL 조회
    const [friendsData, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('image', 'image', 
        'image.imgId = COALESCE(user.defaultImgId, image.subId) AND (user.defaultImgId IS NOT NULL OR (image.subId = user.userId AND image.imgType = :imgType))', 
        { imgType: ImageType.User })
      .where('user.userId IN (:...ids)', {
        ids: friendIds.map((fi) => fi.friendId),
      })
      .select(['user.userId', 'user.userName', 'user.userNick'])
      .addSelect('image.imgUrl', 'userImg')
      .getManyAndCount();

    // 결과 객체 반환
    return {
      result: friendsData.map((friend) => ({
        userId: friend.userId,
        userName: friend.userName,
        userNick: friend.userNick,
        userImg: friend.image ? friend.image.imgUrl : null, // 이미지가 있으면 URL을, 없으면 null
      })),
      total,
    };
  }

  async friendStatus(userId: number, friendId: number): Promise<{ message; }> {
    const friendship = await this.friendRepository
      .createQueryBuilder('friend')
      .where(
        '((friend.userId = :userId AND friend.friendId = :friendId) OR (friend.userId = :friendId AND friend.friendId = :userId))',
        { userId, friendId },
      )
      .getOne();

    if (friendship) {
      if (friendship.status === FriendStatus.Friend) {
        return {
          message: 'friend'
        }
      } else {
        if (friendship.userId === userId && friendship.friendId === friendId) {
          return {
            message: 'request'
          }
        }
        if (friendship.friendId === userId && friendship.userId === friendId) {
          return {
            message: 'requested'
          }
        }
      }
    } else {
      return {
        message: 'notFriend'
      }
    }
  }

  /**
   * 친구 신청
   */
  async createFriend(friendDto: FriendDto): Promise<{ result; message; }> {
    const { userId, friendId } = friendDto;

    // const user = await this.userRepository.findOne({ where: { userId }});
    // const friend = await this.userRepository.findOne({ where: { userId: friendId }});
    // if (!user || !friend) {
    // 	throw new HttpException('존재하지 않는 사용자입니다.', HttpStatus.BAD_REQUEST);
    // }

    if (userId === friendId) {
      throw new HttpException(
        '자기 자신과는 친구가 될 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendship = await this.friendRepository
      .createQueryBuilder('friend')
      .where(
        '((friend.userId = :userId AND friend.friendId = :friendId) OR (friend.userId = :friendId AND friend.friendId = :userId))',
        { userId, friendId },
      )
      .getOne();

    if (friendship) {
      if (friendship.status === FriendStatus.Friend) {
        throw new HttpException(
          '이미 친구인 사용자입니다.',
          HttpStatus.BAD_REQUEST,
        );
      } else if (friendship.status === FriendStatus.Requested) {
        if (friendship.userId === friendId) {
          // Accept friend request
          friendship.status = FriendStatus.Friend;
          const result = await this.friendRepository.save(friendship);

          this.eventEmitter.emit('AcceptFollow', friendDto);

          return {
            result,
            message: '친구 추가 요청을 수락하였습니다.',
          };
        } else {
          // Request already sent
          throw this.g2gException.AlreadySendRequest;
        }
      }
    } else {
      // Send new friend request
      const newFriendship = this.friendRepository.create({
        userId,
        friendId,
        status: FriendStatus.Requested,
      });
      const result = await this.friendRepository.save(newFriendship);
      
      this.eventEmitter.emit('IncomingFollow', friendDto);

      return {
        result,
        message: '친구 추가를 요청하였습니다.',
      };
    }
  }

  /**
   * 친구 삭제, 거절, 취소
   */
  async deleteFriend(
    friendDto: FriendDto,
  ): Promise<{ result; message: string }> {
    const { userId, friendId } = friendDto;

    // const user = await this.userRepository.findOne({ where: { userId }});
    // const friend = await this.userRepository.findOne({ where: { userId: friendId }});
    // if (!user || !friend) {
    // 	throw new HttpException('존재하지 않는 사용자입니다.', HttpStatus.BAD_REQUEST);
    // }

    if (userId == friendId) {
      throw new HttpException(
        'You cannot be friends with yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const friendship = await this.friendRepository
      .createQueryBuilder('friend')
      .where(
        '((friend.userId = :userId AND friend.friendId = :friendId) OR (friend.userId = :friendId AND friend.friendId = :userId))',
        { userId, friendId },
      )
      .getOne();

    let message = '';
    if (friendship) {
      if (friendship.status === FriendStatus.Friend) {
        const noti1 = await this.notiRepository.createQueryBuilder('noti')
        .where('noti.recvId = :recvId', { recvId: friendDto.friendId })
        .andWhere('noti.sendId = :sendId', { sendId: friendDto.userId })
        .andWhere('noti.notiType = :notiType', { notiType: NotiType.NewFriend })
        .getOne();

        const noti2 = await this.notiRepository.createQueryBuilder('noti')
        .where('noti.recvId = :recvId', { recvId: friendDto.userId })
        .andWhere('noti.sendId = :sendId', { sendId: friendDto.friendId })
        .andWhere('noti.notiType = :notiType', { notiType: NotiType.NewFriend })
        .getOne();

        await this.notiRepository.delete(noti1.notiId);
        await this.notiRepository.delete(noti2.notiId);

        message = '친구 삭제가 완료되었습니다.';
      } else {
        const notiType = NotiType.IncomingFollow
        // 보낸 친구 요청 취소
        if (friendship.userId === userId) {
          const noti = await this.notiRepository.createQueryBuilder('noti')
          .where('noti.recvId = :recvId', { recvId: friendDto.friendId })
          .andWhere('noti.sendId = :sendId', { sendId: friendDto.userId })
          .andWhere('noti.notiType = :notiType', { notiType })
          .getOne();

          await this.notiRepository.delete(noti.notiId);
          message = '친구 요청이 취소되었습니다.';
        } else {  // 받은 친구 요청 거절
          if (friendDto.notiId) {
            await this.notiRepository.delete(friendDto.notiId);
          } else {
            const noti = await this.notiRepository
              .createQueryBuilder('noti')
              .where('noti.recvId = :recvId', { recvId: friendDto.userId })
              .andWhere('noti.sendId = :sendId', { sendId: friendDto.friendId })
              .andWhere('noti.notiType = :notiType', { notiType })
              .getOne();
            
            await this.notiRepository.delete(noti.notiId);
          }
          message = '친구 요청을 거절하였습니다.';
        }
      }
      await this.friendRepository.delete({
        userId: friendship.userId,
        friendId: friendship.friendId,
      });
    } else {
      throw new HttpException('친구 관계가 아닙니다.', HttpStatus.BAD_REQUEST);
    }

    return {
      result: friendship,
      message: message,
    };
  }
}
