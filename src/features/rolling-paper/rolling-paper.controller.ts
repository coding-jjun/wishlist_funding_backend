import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';
import { JwtAuthGuard } from '../auth/guard/jwt-auth-guard';
import { User } from 'src/entities/user.entity';
import { Request } from 'express';

/**
 * 펀딩 상세 페이지에서 롤링페이퍼들을 요청합니다.
 * AUTHORIZATION: 펀딩 생성자
 * WHEN: Anytime
 * TODO - 펀딩이 종료된 이후 열람이 가능하도록 변경
 */
@Controller('rollingpaper')
export class RollingPaperController {
  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundUuid')
  @UseGuards(JwtAuthGuard)
  async getAllRollingPapers(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
    @Req() req: Request,
  ): Promise<CommonResponse> {
    const user = req.user as { user: User } as any;
    return {
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundUuid, user),
    };
  }
}
