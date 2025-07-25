import { PartialType } from '@nestjs/swagger';
import { CreateMobileMoneyAccountDto } from './create-mobile-money-account.dto';

export class UpdateMobileMoneyAccountDto extends PartialType(CreateMobileMoneyAccountDto) {}
