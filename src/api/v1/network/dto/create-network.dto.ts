import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNetworkDto {
  @ApiProperty({ description: 'Nom du réseau' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Image du réseau' })
  @IsOptional()
  @IsString()
  image?: string;
}