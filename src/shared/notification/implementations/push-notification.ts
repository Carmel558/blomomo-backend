import { INotification } from "../interface/notification.interface";

export class PushNotification implements INotification {
  send(message: string): void {
    console.log(`Sending push notification: ${message}`);
  }
}
