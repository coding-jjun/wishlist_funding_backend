import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './features/user/user.module';
import { UserController } from './features/user/user.controller';
import { UserService } from './features/user/user.service';
import { EntitiesModule } from './entities/entities.module';

@Module({
  imports: [UserModule, EntitiesModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
