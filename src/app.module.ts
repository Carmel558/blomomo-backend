import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggerModule } from "nestjs-pino";
import { PinoService } from "./shared/logging/pino.service";
import { UserModule } from "./api/v1/users/user/user.module";
import { AuthModule } from "./api/v1/auth/auth.module";
import { NotificationModule } from "./shared/notification/notification.module";
import { ConfigModule } from "@nestjs/config";
import jwtConfig from "./common/config/jwt.config";
import { NetworkModule } from './api/v1/network/network.module';
import { MobileMoneyAccountModule } from './api/v1/mobile-money-account/mobile-money-account.module';
import { TransactionModule } from './api/v1/transaction/transaction.module';
import { ClientModule } from './api/v1/client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    LoggerModule.forRoot(PinoService.createStreams()),
    UserModule,
    NotificationModule,
    AuthModule,
    NetworkModule,
    MobileMoneyAccountModule,
    TransactionModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
