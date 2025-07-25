import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

// src/transaction/dto/create-transaction.dto.ts


export class UpdateTransactionStatusDto {
  @ApiProperty({ 
    description: 'Nouveau statut de la transaction',
    enum: TransactionStatus,
    enumName: 'TransactionStatus'
  })
  @IsEnum(TransactionStatus, { message: 'Statut de transaction invalide' })
  status!: TransactionStatus;
}


