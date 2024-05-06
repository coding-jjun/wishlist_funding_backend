import { Logger, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { GiftogetherExceptionFilter } from "./giftogether-exception.filter";
import { GiftogetherError } from "src/entities/error.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([GiftogetherError])],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: GiftogetherExceptionFilter,
    }
  ]
})
export class ExceptionModule {}