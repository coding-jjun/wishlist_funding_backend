import { Controller, Get, ParseIntPipe, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('/')
    async getUser(
        @Request() req,
    ): Promise<User> {
        return await this.userService.getUserInfo(req.user);
    }

    // @Get('/:userId/fundings')
    // async getUserFunding(
    //     @Param('userId', ParseIntPipe) id: number,
    // ): Promise<Funding[]> {
    //     return await this.fundingService.getUserFundings(userId);
    // }

    // @Get('/:userId/account')
    // async getUserAccount(
    //     @Param('userId', ParseIntPipe) userId: number,
    // ) {
    //     return await this.userService.getUserAccount(userId);
    // }
}
