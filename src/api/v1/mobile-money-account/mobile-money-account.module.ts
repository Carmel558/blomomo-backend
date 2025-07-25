import { Module } from '@nestjs/common';
import { MobileMoneyAccountService } from './mobile-money-account.service';
import { MobileMoneyAccountController } from './mobile-money-account.controller';

@Module({
  controllers: [MobileMoneyAccountController],
  providers: [MobileMoneyAccountService],
})
export class MobileMoneyAccountModule {}
