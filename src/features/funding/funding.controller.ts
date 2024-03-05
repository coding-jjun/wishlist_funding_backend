import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { FundingService } from './funding.service';

@Controller('fundings')
export class FundingController {
    constructor(private service: FundingService) {}

    @Get()
    getAll() {}

    @Post()
    create() {}

    @Get('<id>')
    getDetail() {}

    @Put('<id>')
    update() {}

    @Delete('<id>')
    delete() {}
}
