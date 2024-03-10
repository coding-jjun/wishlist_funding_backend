import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { FriendRequestDto } from './dto/friendRequest.dto';

@Controller('api/friend')
export class FriendController {
    constructor (private readonly friendService: FriendService) {}

    // @Get('/:userId')
    // getFriends(
    //     @Param('userId') userId: number
    // ): Promise<{ result, total}> {
    //     return this.friendService.getFriends(userId);
    // }

    // @Post('/')
    // createFriend(
    //     @Body() body: FriendRequestDto
    // ): Promise<{ result }> {
    //     return this.friendService.createFriend(body);
    // }

    // @Delete('/')
    // deleteFriend(
    //     @Body() body: FriendRequestDto
    // ): Promise<{ result }> {
    //     return this.friendService.deleteFriend(body);
    // }

}
