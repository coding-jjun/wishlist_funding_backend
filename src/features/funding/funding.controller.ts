import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { FundingService } from './funding.service';

@Controller('api/fundings')
export class FundingController {
    constructor(private fundingService: FundingService) {}

    @Get()
    findAll() {}

    @Post()
    create(@Body() createFundingDto /*:CreateFundingDto*/) {}

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.fundingService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, updateFundingDto /*:UpdateFundingDto*/) {
        return this.fundingService.update(id, updateFundingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.fundingService.remove(id);
    }
}
