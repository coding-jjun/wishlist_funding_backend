import { TypeOrmModule } from "@nestjs/typeorm";
import { Funding } from "src/entities/funding.entity";
import { Gift } from "src/entities/gift.entity";
import { GiftController } from "./gift.controller";
import { GiftService } from "./gift.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([Gift, Funding])],
  controllers: [GiftController],
  providers: [GiftService],
  exports: [GiftService],
})
export class GiftModule {}