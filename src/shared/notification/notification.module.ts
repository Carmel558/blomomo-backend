import { Module } from "@nestjs/common";
import { NotificationService } from "./services/notification.service";
import { NotificationFactory } from "./factories/notification.factory";

@Module({
  controllers: [],
  providers: [NotificationService, NotificationFactory],
  exports: [NotificationService],
})
export class NotificationModule {}
