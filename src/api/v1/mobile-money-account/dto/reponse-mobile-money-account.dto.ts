import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';


export class MobileMoneyAccountResponseDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Détails du compte Mobile Money",
      example: {
        data: {
          id: 1,
          phoneNumber: "697530156",
          userId: 1,
          networkId: 1,
          createdAt: "2025-07-26T14:42:13.525Z",
          updatedAt: "2025-07-26T14:42:13.525Z",
          user: {
            id: 1,
            phoneNumber: "690000000"
          },
          network: {
            id: 1,
            name: "MTN"
          }
        }
      },
      required: true,
    })
    data?: object;
  
    @ApiProperty({ example: 200, description: "Statut de la réponse" })
    status?: number;
  
    @ApiProperty({ example: "Compte Mobile Money récupéré avec succès", description: "Message de la réponse" })
    message?: string;
  }


  export class MobileMoneyAccountResponseListDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Liste des comptes Mobile Money",
      example: {
        data: [
          {
            id: 1,
            phoneNumber: "697530156",
            userId: 1,
            networkId: 1,
            createdAt: "2025-07-26T14:42:13.525Z",
            updatedAt: "2025-07-26T14:42:13.525Z",
            network: {
              id: 1,
              name: "MTN"
            }
          },
          {
            id: 2,
            phoneNumber: "655430156",
            userId: 2,
            networkId: 2,
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
        totalItems: 5,
        itemsPerPage: 2,
        currentPage: 1,
        totalPages: 3
      },
      description: "Métadonnées de pagination"
    })
    meta?: object;
  
    @ApiProperty({ example: "Liste des comptes Mobile Money récupérée avec succès", description: "Message de la réponse" })
    message?: string;
  }