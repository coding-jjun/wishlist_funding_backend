import { Controller, Get, Param } from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('api/rollingpaper')
export class RollingPaperController {

  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundUuid')
  async getAllRollingPapers(@Param('fundUuid') fundUuid: string): Promise<CommonResponse>   {
    return {
      timestamp: new Date(Date.now()),
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundUuid)
    };
    
  }
}
