import { Injectable } from '@nestjs/common';
// import { CreateMobileMoneyAccountDto } from './dto/create-mobile-money-account.dto';
// import { UpdateMobileMoneyAccountDto } from './dto/update-mobile-money-account.dto';

@Injectable()
export class MobileMoneyAccountService {
  // create(createMobileMoneyAccountDto: CreateMobileMoneyAccountDto) {
  //   return 'This action adds a new mobileMoneyAccount';
  // }

  findAll() {
    return `This action returns all mobileMoneyAccount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mobileMoneyAccount`;
  }

  // update(id: number, updateMobileMoneyAccountDto: UpdateMobileMoneyAccountDto) {
  //   return `This action updates a #${id} mobileMoneyAccount`;
  // }

  remove(id: number) {
    return `This action removes a #${id} mobileMoneyAccount`;
  }
}
