import { Controller, Get, Param, Delete } from '@nestjs/common';
import { MobileMoneyAccountService } from './mobile-money-account.service';
// import { CreateMobileMoneyAccountDto } from './dto/create-mobile-money-account.dto';
// import { UpdateMobileMoneyAccountDto } from './dto/update-mobile-money-account.dto';

@Controller('mobile-money-account')
export class MobileMoneyAccountController {
  constructor(private readonly mobileMoneyAccountService: MobileMoneyAccountService) {}

  // @Post()
  // create(@Body() createMobileMoneyAccountDto: CreateMobileMoneyAccountDto) {
  //   return this.mobileMoneyAccountService.create(createMobileMoneyAccountDto);
  // }

  @Get()
  findAll() {
    return this.mobileMoneyAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mobileMoneyAccountService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMobileMoneyAccountDto: UpdateMobileMoneyAccountDto) {
  //   return this.mobileMoneyAccountService.update(+id, updateMobileMoneyAccountDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mobileMoneyAccountService.remove(+id);
  }
}
