import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientResponseDto } from './dto/client.response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';


@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau client (Admin seulement)' })
  @ApiResponse({ status: 201, description: 'Client créé avec succès', type: ClientResponseDto })
  @ApiResponse({ status: 409, description: 'Conflit - Client existe déjà' })
  async create(@Request() req: any,@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(req.user.sub, createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les clients (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Liste des clients', type: [ClientResponseDto] })
  async findAll(){
    return this.clientService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des clients (Admin seulement)' })
  @ApiQuery({ name: 'q', description: 'Terme de recherche' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche', type: [ClientResponseDto] })
  async search(@Query('q') query: string){
    return this.clientService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un client par ID (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Détails du client', type: ClientResponseDto })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
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
  @ApiOperation({ summary: 'Supprimer un client (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Client supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Client non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit - Client a des transactions' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientService.remove(id);
    return { message: 'Client supprimé avec succès' };
  }
}