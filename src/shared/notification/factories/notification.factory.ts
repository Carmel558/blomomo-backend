import { EmailNotification } from "../implementations/email-notification";
import { PushNotification } from "../implementations/push-notification";
import { INotification } from "../interface/notification.interface";

export class NotificationFactory {
  createNotification(type: string): INotification {
    switch (type) {
      case "email":
        return new EmailNotification();
      case "push":
        return new PushNotification();
      default:
        throw new Error(`Notification type ${type} is not supported.`);
    }
  }
}
