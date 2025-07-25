import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({ description: 'Prénom du client' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ description: 'Nom de famille du client' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ description: 'Numéro de téléphone du client' })
    @IsString()
    phoneNumber!: string;

    @ApiPropertyOptional({ description: 'Email du client' })
    @IsOptional()
    @IsEmail()
    email?: string;
}