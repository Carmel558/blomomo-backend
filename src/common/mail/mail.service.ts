import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface OrderDetails {
  dishes: Array<{
    title: string;
    price: number;
  }>;
  totalAmount: number;
  deliveryTime: Date;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get('mail.port'),
      secure: this.configService.get('mail.secure'),
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.password'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('app.url')}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('app.url')}/auth/reset-password?token=${token}`;

    await this.transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });
  }

  async sendOrderConfirmationEmail(email: string, orderDetails: OrderDetails): Promise<void> {
    await this.transporter.sendMail({
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h1>Order Confirmation</h1>
        <p>Your order has been confirmed. Here are the details:</p>
        <ul>
          ${orderDetails.dishes.map((dish: { title: string; price: number }) => 
            `<li>${dish.title} - ${dish.price}</li>`
          ).join('')}
        </ul>
        <p>Total Amount: ${orderDetails.totalAmount}</p>
        <p>Delivery Time: ${orderDetails.deliveryTime}</p>
      `,
    });
  }
} 