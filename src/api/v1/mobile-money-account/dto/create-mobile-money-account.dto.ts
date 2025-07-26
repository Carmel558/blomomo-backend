import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMobileMoneyAccountDto {
  @ApiPropertyOptional({
    description: 'Numéro de téléphone du compte Mobile Money',
    example: '+22961234567',
    type: String,
  })
  @IsString()
  phoneNumber!: string;

  @ApiProperty({
    description: 'ID du réseau Mobile Money',
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  networkId!: number;
}