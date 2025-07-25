import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninUserQueryDto {
  @ApiProperty({
    description: "User email.",
    example: "john.doe@gmail.com",
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "User password.",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
