import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { NetworkResponseDto } from './dto/network-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('networks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/networks')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Créer un nouveau réseau (Admin seulement)' })
  @ApiResponse({ status: 201, description: 'Réseau créé avec succès', type: NetworkResponseDto })
  @ApiResponse({ status: 409, description: 'Conflit - Réseau existe déjà' })
  async create(@Body() createNetworkDto: CreateNetworkDto){
    return this.networkService.create(createNetworkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les réseaux (Tous les utilisateurs connectés)' })
  @ApiResponse({ status: 200, description: 'Liste des réseaux', type: [NetworkResponseDto] })
  async findAll(){
    return this.networkService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Récupérer un réseau par ID (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Détails du réseau', type: NetworkResponseDto })
  @ApiResponse({ status: 404, description: 'Réseau non trouvé' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.networkService.findOne(id);
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Récupérer les statistiques d\'un réseau (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Statistiques du réseau' })
  @ApiResponse({ status: 404, description: 'Réseau non trouvé' })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    return this.networkService.getNetworkStats(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un réseau (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Réseau mis à jour', type: NetworkResponseDto })
  @ApiResponse({ status: 404, description: 'Réseau non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit - Nom déjà utilisé' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNetworkDto: UpdateNetworkDto,
  ){
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Supprimer un réseau (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Réseau supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Réseau non trouvé' })
  @ApiResponse({ status: 409, description: 'Conflit - Réseau a des comptes/transactions' })
  async remove(@Param('id', ParseIntPipe) id: number){
    await this.networkService.remove(id);
    return { message: 'Réseau supprimé avec succès' };
  }
}