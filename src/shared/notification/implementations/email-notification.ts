import { INotification } from "../interface/notification.interface";

export class EmailNotification implements INotification {
  send(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}
