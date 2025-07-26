import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('api/v1/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle transaction' })
  @ApiResponse({ status: 201, description: 'Transaction créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Client ou réseau non trouvé' })
  async create(@Request() req: any, @Body() createTransactionDto: CreateTransactionDto) {
    console.log('Creating transaction for user:', req);
    return this.transactionService.create(req.user.sub, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les transactions avec pagination et filtres' })
  @ApiResponse({ status: 200, description: 'Liste des transactions récupérée avec succès' })
  async findAll(@Request() req: any, @Query() query: TransactionQueryDto) {
    const userId = req.user.role === UserRole.ADMIN ? query.userId : req.user.sub;
    return this.transactionService.findAllWithFilters(userId, query);
  }

  @Get('my-transactions')
  @ApiOperation({ summary: 'Obtenir mes transactions' })
  @ApiResponse({ status: 200, description: 'Liste des transactions de l\'utilisateur connecté' })
  async getMyTransactions(@Request() req: any, @Query() query: TransactionQueryDto) {
    return this.transactionService.findAllWithFilters(req.user.sub, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtenir les statistiques des transactions' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès' })
  async getStats(@Request() req: any, @Query('userId', ParseIntPipe) userId?: number) {
    // Si l'utilisateur n'est pas admin, il ne peut voir que ses propres stats
    const targetUserId = req.user.role === UserRole.ADMIN ? userId : req.user.sub;
    return this.transactionService.getTransactionStats(targetUserId);
  }

  @Get('clients/search')
  @ApiOperation({ summary: 'Rechercher des clients par numéro de téléphone' })
  @ApiResponse({ status: 200, description: 'Liste des clients trouvés' })
  async searchClients(
    @Query('phoneNumber') phoneNumber: string,
    @Query('limit', ParseIntPipe) limit: number = 5
  ) {
    if (!phoneNumber) {
      throw new BadRequestException('Le numéro de téléphone est requis pour la recherche');
    }
    return this.transactionService.searchClientsByPhone(phoneNumber, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une transaction par ID' })
  @ApiResponse({ status: 200, description: 'Transaction trouvée' })
  @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.transactionService.findOne(id, req.user.role, req.user.sub);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une transaction (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Statut de la transaction mis à jour' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateTransactionStatusDto
  ) {
    return this.transactionService.updateStatus(id, updateStatusDto.status);
  }

  // Endpoints spécifiques pour les admins
  @Get('admin/all')
  @ApiOperation({ summary: 'Obtenir toutes les transactions (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Toutes les transactions récupérées' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  async findAllForAdmin(@Query() query: TransactionQueryDto) {
    return this.transactionService.findAllWithFilters(undefined, query);
  }

  @Get('admin/stats')
  @ApiOperation({ summary: 'Obtenir les statistiques globales (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Statistiques globales récupérées' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  async getGlobalStats() {
    return this.transactionService.getTransactionStats();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtenir les transactions d\'un utilisateur spécifique (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Transactions de l\'utilisateur récupérées' })
  @ApiResponse({ status: 403, description: 'Accès refusé - Admin requis' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: TransactionQueryDto
  ) {
    return this.transactionService.findAllWithFilters(userId, query);
  }
}