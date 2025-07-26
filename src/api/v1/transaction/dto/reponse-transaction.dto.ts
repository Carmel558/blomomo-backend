import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class TransactionResponseDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Détails de la transaction",
      example: {
        data: {
          id: 1,
          userId: 1,
          clientId: 2,
          amount: 5000,
          status: "COMPLETED",
          networkId: 1,
          mobileMoneyAccountId: 1,
          createdAt: "2025-07-26T14:42:13.525Z",
          updatedAt: "2025-07-26T14:42:13.525Z",
          user: {
            id: 1,
            phoneNumber: "690000000"
          },
          client: {
            id: 2,
            phoneNumber: "697530156"
          },
          network: {
            id: 1,
            name: "MTN"
          },
          mobileMoneyAccount: {
            id: 1,
            phoneNumber: "697530156"
          }
        }
      },
      required: true,
    })
    data?: object;
  
    @ApiProperty({ example: 200, description: "Statut de la réponse" })
    status?: number;
  
    @ApiProperty({ example: "Transaction récupérée avec succès", description: "Message de la réponse" })
    message?: string;
  }

  export class TransactionResponseListDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Liste des transactions",
      example: {
        data: [
          {
            id: 1,
            userId: 1,
            clientId: 2,
            amount: 5000,
            status: "COMPLETED",
            networkId: 1,
            mobileMoneyAccountId: 1,
            createdAt: "2025-07-26T14:42:13.525Z",
            updatedAt: "2025-07-26T14:42:13.525Z",
            network: {
              id: 1,
              name: "MTN"
            }
          },
          {
            id: 2,
            userId: 1,
            clientId: 3,
            amount: 10000,
            status: "PENDING",
            networkId: 2,
            mobileMoneyAccountId: 2,
            createdAt: "2025-07-26T15:14:30.168Z",
            updatedAt: "2025-07-26T15:14:30.168Z",
            network: {
              id: 2,
              name: "Orange"
            }
          }
        ]
      },
      required: true,
    })
    data?: object;
  
    @ApiProperty({ example: 200, description: "Statut de la réponse" })
    status?: number;
  
    @ApiProperty({
      example: {
        totalItems: 15,
        itemsPerPage: 2,
        currentPage: 1,
        totalPages: 8
      },
      description: "Métadonnées de pagination"
    })
    meta?: object;
  
    @ApiProperty({ example: "Liste des transactions récupérée avec succès", description: "Message de la réponse" })
    message?: string;
  }