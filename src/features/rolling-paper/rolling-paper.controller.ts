import { Controller, Get, Param } from '@nestjs/common';
import { RollingPaperService } from './rolling-paper.service';

@Controller('api/rollingpaper')
export class RollingPaperController {

  constructor(private rollingPaperService: RollingPaperService) {}

  @Get('/:fundUuid')
  async getAllRollingPapers(
    @Param('fundUuid') fundUuid: string
  ): Promise<any>   {
    return {
      message: 'RollingPaper 조회 성공',
      data: await this.rollingPaperService.getAllRollingPapers(fundUuid)
    };
    
  }
}
