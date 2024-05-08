import { Controller, Get, Param } from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';
import { CommonResponse } from 'src/interfaces/common-response.interface';

@Controller('rollingpaper')
export class RollingPaperController {

  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundId')
  async getAllRollingPapers(
    @Param('fundId') fundId: number
  ): Promise<CommonResponse>   {
    return {
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundId)
    };
    
  }
}
