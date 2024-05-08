import { Controller, Get, Param } from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';

@Controller('rollingpaper')
export class RollingPaperController {

  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundId')
  async getAllRollingPapers(@Param('fundId') fundId: number): Promise<any>   {
    return {
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundId)
    };
    
  }
}
