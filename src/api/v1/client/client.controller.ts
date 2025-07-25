// src/client/client.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client.desponse.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { UserRole } from '@prisma/client';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  // @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau client (Admin seulement)' })
  @ApiResponse({ status: 201, description: 'Client créé avec succès', type: ClientResponseDto })
  @ApiResponse({ status: 409, description: 'Conflit - Client existe déjà' })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  // @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Récupérer tous les clients (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Liste des clients', type: [ClientResponseDto] })
  async findAll(){
    return this.clientService.findAll();
  }

  @Get('search')
  // @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Rechercher des clients (Admin seulement)' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche', type: [ClientResponseDto] })
  async search(@Query('q') query: string){
    return this.clientService.search(query);
  }

  @Get(':id')
  // @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Récupérer un client par ID (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Détails du client', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  // @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un client (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Client mis à jour', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit - Données en double' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un client (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Client supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit - Client a des transactions' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientService.remove(id);
    return { message: 'Client supprimé avec succès' };
  }
}