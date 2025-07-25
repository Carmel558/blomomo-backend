import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import { IsValidPhoneNumber } from "src/shared/decorator/is-valid-phone.decorator";
import { STRING_MAX_SIZE } from "src/shared/resources/validator.resources";

export class CreateUserQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: "John",
    required: true,
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: "Doe",
    required: true,
  })
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: "john.doe@gmail.com",
    required: true,
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPhoneNumber()
  @ApiProperty({
    description: "Téléphone de l'utilisateur",
    example: "+22912345678",
    required: true,
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: "JohnPm690@kjd9",
    required: true,
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Type d'utilisateur (SUB_ADMIN ou DELIVERY_PERSON)",
    example: "SUB_ADMIN",
    required: true,
  })
  userType!: string;

}

export class CreateUserQueryDtoAdmin {
  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: "John",
    required: true,
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: "Doe",
    required: true,
  })
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "Email de l'utilisateur",
    example: "john.doe@gmail.com",
    required: true,
  })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsValidPhoneNumber()
  @ApiProperty({
    description: "Téléphone de l'utilisateur",
    example: "+22912345678",
    required: true,
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_SIZE)
  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: "JohnPm690@kjd9",
    required: true,
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Type d'utilisateur (SUB_ADMIN ou DELIVERY_PERSON)",
    example: "SUB_ADMIN",
    required: true,
  })
  userType!: string;

}
