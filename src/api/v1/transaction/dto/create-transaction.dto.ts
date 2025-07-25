import { IsNumber, IsPositive, IsString, IsOptional, Min, IsEnum, Max, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TransactionStatus } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Montant de la transaction', minimum: 1 })
  @IsNumber({}, { message: 'Le montant doit être un nombre' })
  @IsPositive({ message: 'Le montant doit être positif' })
  @Min(1, { message: 'Le montant minimum est de 1' })
  @Type(() => Number)
  amount!: number;

  @ApiProperty({ description: 'ID du réseau mobile money' })
  @IsNumber({}, { message: 'L\'ID du réseau doit être un nombre' })
  @IsPositive({ message: 'L\'ID du réseau doit être positif' })
  @Type(() => Number)
  networkId!: number;

  @ApiPropertyOptional({ description: 'ID du client existant' })
  @IsOptional()
  @IsNumber({}, { message: 'L\'ID du client doit être un nombre' })
  @IsPositive({ message: 'L\'ID du client doit être positif' })
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({ description: 'Numéro de téléphone de l\'utilisateur' })
  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne' })
  phoneNumberUser?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone du client' })
  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Prénom du client (pour création automatique)' })
  @IsOptional()
  @IsString({ message: 'Le prénom doit être une chaîne' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Nom de famille du client (pour création automatique)' })
  @IsOptional()
  @IsString({ message: 'Le nom de famille doit être une chaîne' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Email du client (pour création automatique)' })
  @IsOptional()
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email?: string;
}


export class TransactionQueryDto {
  @ApiPropertyOptional({ description: 'Numéro de page', minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'La page doit être un nombre' })
  @Min(1, { message: 'La page doit être supérieure à 0' })
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Taille de la page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsNumber({}, { message: 'La taille doit être un nombre' })
  @Min(1, { message: 'La taille doit être supérieure à 0' })
  @Max(100, { message: 'La taille maximum est de 100' })
  @Type(() => Number)
  size?: number = 10;

  @ApiPropertyOptional({ 
    description: 'Champ de tri',
    enum: ['createdAt', 'amount', 'status', 'updatedAt'],
    default: 'createdAt'
  })
  @IsOptional()
  @IsEnum(['createdAt', 'amount', 'status', 'updatedAt'], { 
    message: 'Le champ de tri doit être: createdAt, amount, status, ou updatedAt' 
  })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ 
    description: 'Ordre de tri',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'L\'ordre doit être asc ou desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ 
    description: 'Filtrer par statut',
    enum: TransactionStatus
  })
  @IsOptional()
  @IsEnum(TransactionStatus, { message: 'Statut de transaction invalide' })
  status?: TransactionStatus;

  @ApiPropertyOptional({ description: 'ID de l\'utilisateur (admin seulement)' })
  @IsOptional()
  @IsNumber({}, { message: 'L\'ID utilisateur doit être un nombre' })
  @Type(() => Number)
  userId?: number;

  @ApiPropertyOptional({ description: 'ID du client' })
  @IsOptional()
  @IsNumber({}, { message: 'L\'ID client doit être un nombre' })
  @Type(() => Number)
  clientId?: number;

  @ApiPropertyOptional({ description: 'ID du réseau' })
  @IsOptional()
  @IsNumber({}, { message: 'L\'ID réseau doit être un nombre' })
  @Type(() => Number)
  networkId?: number;

  @ApiPropertyOptional({ description: 'Montant minimum' })
  @IsOptional()
  @IsNumber({}, { message: 'Le montant minimum doit être un nombre' })
  @Min(0, { message: 'Le montant minimum doit être positif' })
  @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Montant maximum' })
  @IsOptional()
  @IsNumber({}, { message: 'Le montant maximum doit être un nombre' })
  @Min(0, { message: 'Le montant maximum doit être positif' })
  @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'Date de début (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date invalide (utilisez YYYY-MM-DD)' })
  startDate?: string;

  @ApiPropertyOptional({ description: 'Date de fin (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Format de date invalide (utilisez YYYY-MM-DD)' })
  endDate?: string;
}


export class ClientSearchDto {
  @ApiProperty({ description: 'Numéro de téléphone à rechercher' })
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne' })
  phoneNumber!: string;

  @ApiPropertyOptional({ description: 'Nombre maximum de résultats', minimum: 1, maximum: 20, default: 5 })
  @IsOptional()
  @IsNumber({}, { message: 'La limite doit être un nombre' })
  @Min(1, { message: 'La limite minimum est de 1' })
  @Max(20, { message: 'La limite maximum est de 20' })
  @Type(() => Number)
  limit?: number = 5;
}