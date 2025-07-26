import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';


export class NetworkResponseDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Détails du réseau",
      example: {
        data: {
          id: 1,
          name: "MTN",
          image: "https://example.com/mtn.png",
          createdAt: "2025-07-26T14:42:13.525Z",
          updatedAt: "2025-07-26T14:42:13.525Z"
        }
      },
      required: true,
    })
    data?: object;
  
    @ApiProperty({ example: 200, description: "Statut de la réponse" })
    status?: number;
  
    @ApiProperty({ example: "Réseau récupéré avec succès", description: "Message de la réponse" })
    message?: string;
  }

  export class NetworkResponseListDto {
    @IsNotEmpty()
    @IsObject()
    @ApiProperty({
      description: "Liste des réseaux",
      example: {
        data: [
          {
            id: 1,
            name: "MTN",
            image: "https://example.com/mtn.png",
            createdAt: "2025-07-26T14:42:13.525Z",
            updatedAt: "2025-07-26T14:42:13.525Z"
          },
          {
            id: 2,
            name: "Orange",
            image: "https://example.com/orange.png",
            createdAt: "2025-07-26T15:14:30.168Z",
            updatedAt: "2025-07-26T15:14:30.168Z"
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
        totalItems: 3,
        itemsPerPage: 2,
        currentPage: 1,
        totalPages: 2
      },
      description: "Métadonnées de pagination"
    })
    meta?: object;
  
    @ApiProperty({ example: "Liste des réseaux récupérée avec succès", description: "Message de la réponse" })
    message?: string;
  }