import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { FriendDto } from './dto/friend.dto';

@Controller('api/friend')
export class FriendController {
	constructor (private readonly friendService: FriendService) {}

	@Get('/:userId')
	async getFriends(
			@Param('userId') userId: number
	): Promise<any> {
		try {
			return {
				message: '친구 조회에 성공하였습니다.',
				data: await this.friendService.getFriends(userId),
			}
		} catch (error) {
			throw new HttpException(
				'Failed to read friends',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post('/')
	async createFriend(
			@Body() friendDto: FriendDto,
	): Promise<any> {
		try {
			const { result, message } = await this.friendService.createFriend(friendDto);

			return {
				message: message,
				data: result,
			}
		} catch (error) {
			throw error;
		}
	}

	@Delete('/')
	async deleteFriend(
		@Body() friendDto: FriendDto
	): Promise<any> {
		try {
			const { result, message } = await this.friendService.deleteFriend(friendDto);

			return {
				message: message,
				data: result,
			}
		} catch (error) {
			throw new HttpException(
				'Failed to delete friend',
				HttpStatus.BAD_REQUEST
			)
		}
	}
}