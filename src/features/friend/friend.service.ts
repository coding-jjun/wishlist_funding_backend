import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendService {
    // constructor(
    //     @InjectRepository(User)
    //     private readonly userRepository: Repository<User>,
    //     @InjectRepository(Friend)
    //     private readonly friendRepository: Repository<Friend>,
    // ) {}
    
    // /**
    //  * 친구 목록 조회
    //  * @param userId
    //  */
    // async getFriends(userId: number): Promise<{ result, total }> {
    //     const friends = await this.userRepository.createQueryBuilder('user')
    //         .select([
    //             'user'
    //         ])
    // }
}
