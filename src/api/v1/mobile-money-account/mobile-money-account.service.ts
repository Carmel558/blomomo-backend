import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMobileMoneyAccountDto } from './dto/create-mobile-money-account.dto';
import { UpdateMobileMoneyAccountDto } from './dto/update-mobile-money-account.dto';

@Injectable()
export class MobileMoneyAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createMobileMoneyAccountDto: CreateMobileMoneyAccountDto): Promise<any> {
    
    if (!userId || typeof userId !== 'number') {
      throw new BadRequestException('ID utilisateur invalide');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const existingAccount = await this.prisma.mobileMoneyAccount.findUnique({
      where: { phoneNumber: createMobileMoneyAccountDto.phoneNumber, userId: userId },
    });

    if (existingAccount) {
      throw new ConflictException('Un compte Mobile Money existe déjà pour cet utilisateur');
    }

    const network = await this.prisma.network.findUnique({
      where: { id: createMobileMoneyAccountDto.networkId },
    });

    if (!network) {
      throw new NotFoundException('Réseau non trouvé');
    }

    const mobileMoneyAccount = await this.prisma.mobileMoneyAccount.create({
      data: {
        phoneNumber: createMobileMoneyAccountDto.phoneNumber || null,
        user: {
          connect: { id: userId }
        },
        network: {
          connect: { id: createMobileMoneyAccountDto.networkId }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          }
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return {
      data: mobileMoneyAccount,
      message: 'Compte Mobile Money créé avec succès',
      status: 201,
    };
  }

  async findAll(): Promise<any> {
    const accounts = await this.prisma.mobileMoneyAccount.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          }
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: accounts,
      message: 'Liste des comptes Mobile Money récupérée avec succès',
      status: 200,
    };
  }

  async findOne(id: number): Promise<any> {
    const account = await this.prisma.mobileMoneyAccount.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          }
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10, 
        }
      }
    });

    if (!account) {
      throw new NotFoundException(`Compte Mobile Money avec l'ID ${id} non trouvé`);
    }

    return {
      data: account,
      message: 'Compte Mobile Money trouvé avec succès',
      status: 200,
    };
  }

  async findByUser(userId: number): Promise<any> {
    const account = await this.prisma.mobileMoneyAccount.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          }
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!account) {
      throw new NotFoundException(`Aucun compte Mobile Money trouvé pour l'utilisateur ${userId}`);
    }

    return {
      data: account,
      message: 'Compte Mobile Money de l\'utilisateur trouvé avec succès',
      status: 200,
    };
  }

  async update(id: number, updateMobileMoneyAccountDto: UpdateMobileMoneyAccountDto): Promise<any> {
    const existingAccount = await this.prisma.mobileMoneyAccount.findUnique({
      where: { id },
    });

    if (!existingAccount) {
      throw new NotFoundException(`Compte Mobile Money avec l'ID ${id} non trouvé`);
    }

    // Si on change le réseau, vérifier qu'il existe
    if (updateMobileMoneyAccountDto.networkId) {
      const network = await this.prisma.network.findUnique({
        where: { id: updateMobileMoneyAccountDto.networkId },
      });

      if (!network) {
        throw new NotFoundException('Réseau non trouvé');
      }
    }

    const updatedAccount = await this.prisma.mobileMoneyAccount.update({
      where: { id },
      data: updateMobileMoneyAccountDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          }
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return {
      data: updatedAccount,
      message: 'Compte Mobile Money mis à jour avec succès',
      status: 200,
    };
  }

  async remove(id: number): Promise<any> {
    const account = await this.prisma.mobileMoneyAccount.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Compte Mobile Money avec l'ID ${id} non trouvé`);
    }

    // Vérifier s'il y a des transactions liées
    const transactionCount = await this.prisma.transaction.count({
      where: { mobileMoneyAccountId: id },
    });

    if (transactionCount > 0) {
      throw new ConflictException('Impossible de supprimer un compte Mobile Money ayant des transactions');
    }

    await this.prisma.mobileMoneyAccount.delete({
      where: { id },
    });

    return {
      data: account,
      message: 'Compte Mobile Money supprimé avec succès',
      status: 200,
    };
  }

  async getMyAccount(userId: number): Promise<any> {
    
    if (!userId || typeof userId !== 'number') {
      throw new BadRequestException('ID utilisateur invalide');
    }

    return this.findByUser(userId);
  }
}