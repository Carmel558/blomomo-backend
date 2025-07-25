import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../enums/user-type.enum';

function randomPasswordExample() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!';
  let pass = '';
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export class RegisterDto {
  @ApiProperty({ description: "Numero téléphone de l'utilisateur", example: "+22912345678" })
  @IsString()
  phoneNumber!: string;
}

export class LoginDto {
  @ApiProperty({ description: "Numéro de téléphone de l'utilisateur", example: "+22912345678" })
  @IsString()
  phoneNumber!: string;
}

export class RegisterDtoAdmin {
  @ApiProperty({ description: "Prénom de l'utilisateur", example: "John" })
  @IsString()
  firstName!: string;

  @ApiProperty({ description: "Nom de l'utilisateur", example: "Doe" })
  @IsString()
  lastName!: string;

  @ApiProperty({ description: "Email de l'utilisateur", example: "john.doe@gmail.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Téléphone de l'utilisateur", example: "+22912345678" })
  @IsString()
  phoneNumber!: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur", example: randomPasswordExample(), required: true })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: "Type d'utilisateur", enum: UserType, required: false })
  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;
}

export class LoginDtoAdmin {
  @ApiProperty({ description: "Email de l'utilisateur", example: "john.doe@gmail.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "Mot de passe de l'utilisateur", example: "password123" })
  @IsString()
  password!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: "Mot de passe actuel", example: "oldpassword" })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ description: "Nouveau mot de passe", example: "newpassword123" })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: "Email de l'utilisateur", example: "john.doe@gmail.com" })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: "Token de réinitialisation", example: "abcdef123456" })
  @IsString()
  token!: string;

  @ApiProperty({ description: "Nouveau mot de passe", example: "newpassword123" })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: "Token de vérification", example: "abcdef123456" })
  @IsString()
  token!: string;
}

export class VerifyPhoneDto {
  @ApiProperty({ description: "Token de vérification", example: "abcdef123456" })
  @IsString()
  token!: string;
}


export class RefreshTokenDto {
  @ApiProperty({ description: "Token de refresh", example: "abcdef123456" })
  @IsString()
  token!: string;
}