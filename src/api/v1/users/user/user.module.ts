import { Module } from "@nestjs/common";
import { PrismaModule } from "src/shared/prisma/prisma.module";
import { UserService } from "./user.service";
import { userController } from "./user.controller";
import { UserBusiness } from "./user.business";

@Module({
  imports: [PrismaModule],
  controllers: [userController],
  providers: [UserService, UserBusiness],
  exports: [UserBusiness],
})
export class UserModule {}
