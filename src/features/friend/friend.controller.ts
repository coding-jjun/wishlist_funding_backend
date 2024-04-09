import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendService } from './friend.service';
import { FriendDto } from './dto/friend.dto';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('api/friend')
export class FriendController {
	constructor (private readonly friendService: FriendService) {}

	@Get('/:userId')
	async getFriends(
			@Param('userId') userId: number
	): Promise<CommonResponse> {
		try {
			const data = await this.friendService.getFriends(userId);

			return {
				timestamp: new Date(),
				message: 'Success',
				data: data,
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
	): Promise<CommonResponse> {
		try {
			const { result, message } = await this.friendService.createFriend(friendDto);

			return {
				timestamp: new Date(),
				message: message,
				data: result,
			}
		} catch (error) {
			throw new HttpException(
				error.message,
				HttpStatus.BAD_REQUEST
			);
		}
	}

	@Delete('/')
	async deleteFriend(
		@Body() friendDto: FriendDto
	): Promise<CommonResponse> {
		try {
			const { result, message } = await this.friendService.deleteFriend(friendDto);

			return {
				timestamp: new Date(),
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