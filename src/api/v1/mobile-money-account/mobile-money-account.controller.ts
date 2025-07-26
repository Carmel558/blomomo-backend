import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MobileMoneyAccountService } from './mobile-money-account.service';
import { CreateMobileMoneyAccountDto } from './dto/create-mobile-money-account.dto';
import { UpdateMobileMoneyAccountDto } from './dto/update-mobile-money-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Mobile Money Accounts')
@ApiBearerAuth()
@Controller('api/v1/mobile-money-accounts')
@UseGuards(JwtAuthGuard)
export class MobileMoneyAccountController {
  constructor(private readonly mobileMoneyAccountService: MobileMoneyAccountService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer un compte Mobile Money',
    description: 'Crée un nouveau compte Mobile Money pour l\'utilisateur connecté'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Compte Mobile Money créé avec succès',
    schema: {
      example: {
        data: {
          id: 1,
          phoneNumber: '+22961234567',
          userId: 1,
          networkId: 1,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+22961234567'
          },
          network: {
            id: 1,
            name: 'MTN Mobile Money',
            image: 'mtn-logo.png'
          }
        },
        message: 'Compte Mobile Money créé avec succès',
        status: 201
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Un compte existe déjà pour cet utilisateur' })
  create(@Body() createMobileMoneyAccountDto: CreateMobileMoneyAccountDto, @Request() req: any) {
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      throw new BadRequestException('Impossible de récupérer l\'ID utilisateur depuis le token');
    }
    
    return this.mobileMoneyAccountService.create(Number(userId), createMobileMoneyAccountDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lister tous les comptes Mobile Money',
    description: 'Récupère la liste de tous les comptes Mobile Money'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste récupérée avec succès',
    schema: {
      example: {
        data: [
          {
            id: 1,
            phoneNumber: '+22961234567',
            userId: 1,
            networkId: 1,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            user: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              phoneNumber: '+22961234567'
            },
            network: {
              id: 1,
              name: 'MTN Mobile Money',
              image: 'mtn-logo.png'
            }
          }
        ],
        message: 'Liste des comptes Mobile Money récupérée avec succès',
        status: 200
      }
    }
  })
  findAll() {
    return this.mobileMoneyAccountService.findAll();
  }

  @Get('my-account')
  @ApiOperation({ 
    summary: 'Récupérer mon compte Mobile Money',
    description: 'Récupère le compte Mobile Money de l\'utilisateur connecté'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compte trouvé avec succès' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun compte trouvé pour cet utilisateur' 
  })
  getMyAccount(@Request() req: any) {
    const userId = req.user?.id || req.user?.sub;
    
    if (!userId) {
      throw new BadRequestException('Impossible de récupérer l\'ID utilisateur depuis le token');
    }
    
    return this.mobileMoneyAccountService.getMyAccount(Number(userId));
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Récupérer le compte d\'un utilisateur',
    description: 'Récupère le compte Mobile Money d\'un utilisateur spécifique'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'ID de l\'utilisateur',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compte trouvé avec succès' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aucun compte trouvé pour cet utilisateur' 
  })
  findByUser(@Param('userId') userId: string) {
    return this.mobileMoneyAccountService.findByUser(+userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un compte par ID',
    description: 'Récupère les détails d\'un compte Mobile Money par son ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID du compte Mobile Money',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compte trouvé avec succès' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Compte non trouvé' 
  })
  findOne(@Param('id') id: string) {
    return this.mobileMoneyAccountService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Modifier un compte Mobile Money',
    description: 'Met à jour les informations d\'un compte Mobile Money'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID du compte Mobile Money',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compte mis à jour avec succès' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Compte non trouvé' 
  })
  update(@Param('id') id: string, @Body() updateMobileMoneyAccountDto: UpdateMobileMoneyAccountDto) {
    return this.mobileMoneyAccountService.update(+id, updateMobileMoneyAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer un compte Mobile Money',
    description: 'Supprime un compte Mobile Money (impossible s\'il a des transactions)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID du compte Mobile Money',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Compte supprimé avec succès' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Compte non trouvé' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Impossible de supprimer un compte ayant des transactions' 
  })
  remove(@Param('id') id: string) {
    return this.mobileMoneyAccountService.remove(+id);
  }
}