import { IUser } from "../interface/user.interface";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsString,
  IsEmail,
  IsDate,
  MaxLength,
} from "class-validator";
import { IsValidPhoneNumber } from "src/shared/decorator/is-valid-phone.decorator";
import { STRING_MAX_SIZE } from "src/shared/resources/validator.resources";
// import { INTEGER_MAXIMUM_VALUE } from "src/shared/resources/number.resources";

export class UserResponseDto {
  @ApiProperty({ description: "Identifiant de l'utilisateur", example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: "Email de l'utilisateur", example: "john.doe@gmail.com" })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Prénom de l'utilisateur", example: "John" })
  @IsString()
  @MaxLength(STRING_MAX_SIZE)
  firstName: string;

  @ApiProperty({ description: "Nom de l'utilisateur", example: "Doe" })
  @IsString()
  @MaxLength(STRING_MAX_SIZE)
  lastName: string;

  @ApiProperty({ description: "Téléphone de l'utilisateur", example: "+22912345678" })
  @IsString()
  @IsValidPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: "Date de création", example: new Date().toISOString() })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: "Date de mise à jour", example: new Date().toISOString() })
  @IsDate()
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email?? "";
    this.firstName = user.firstName ?? "";
    this.lastName = user.lastName ?? "";
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
