import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('rollingpaper')
export class RollingPaperController {
  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundUuid')
  async getAllRollingPapers(
    @Param('fundUuid', ParseUUIDPipe) fundUuid: string,
  ): Promise<CommonResponse> {
    return {
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundUuid),
    };
  }
}
