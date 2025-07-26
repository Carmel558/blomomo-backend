import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class ClientResponseDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: "Détails du Client.",
    example: {
      data: {
        "id": 2,
        "firstName": "string",
        "lastName": "string",
        "phoneNumber": "string",
        "userId": 1,
        "email": null,
        "createdAt": "2025-07-26T15:14:30.168Z",
        "updatedAt": "2025-07-26T15:14:30.168Z"
      },
    },
    required: true,
  })
  data?: object;

  @ApiProperty({ example: 200, description: "Statut de la réponse" })
  status?: number;

  @ApiProperty({
    example: {
      totalItems: 10,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 2
    },
    description: "Statut de la réponse"
  })
  meta?: object;

  @ApiProperty({ example: "Client récupéré avec succès", description: "Message de la réponse" })
  message?: string;

}

export class ClientResponseListeDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: "Détails du code promo.",
    example: {
      data: [
    {
      "id": 2,
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "userId": 1,
      "email": null,
      "createdAt": "2025-07-26T15:14:30.168Z",
      "updatedAt": "2025-07-26T15:14:30.168Z"
    },
    {
      "id": 1,
      "firstName": null,
      "lastName": null,
      "phoneNumber": "9756301562",
      "userId": 3,
      "email": null,
      "createdAt": "2025-07-26T14:42:13.525Z",
      "updatedAt": "2025-07-26T14:42:13.525Z"
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
      totalItems: 10,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 2
    },
    description: "Statut de la réponse"
  })
  meta?: object;

  @ApiProperty({ example: "Liste des clients récupérée avec succès", description: "Message de la réponse" })
  message?: string;
}