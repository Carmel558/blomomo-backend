import { Injectable } from "@nestjs/common";
import { NotificationFactory } from "../factories/notification.factory";

@Injectable()
export class NotificationService {
  constructor(private readonly notificationFactory: NotificationFactory) {}

  sendNotification(type: string, message: string): void {
    const notification = this.notificationFactory.createNotification(type);
    notification.send(message);
  }
}
