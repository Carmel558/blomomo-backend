// src/transaction/services/transaction-enhanced.service.ts (méthodes ajoutées)
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus, UserRole } from '@prisma/client';

// Interface pour les options de filtrage
interface TransactionFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: TransactionStatus;
  userId?: number;
  clientId?: number;
  networkId?: number;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  // Méthode pour obtenir toutes les transactions avec filtres et pagination
  async findAllWithFilters(
    userId?: number, 
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<any>> {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      clientId,
      networkId,
      minAmount,
      maxAmount,
      startDate,
      endDate
    } = filters;

    // Validation de la pagination
    const validatedPage = Math.max(1, Number(page));
    const validatedSize = Math.min(100, Math.max(1, Number(size))); // Maximum 100 éléments par page
    const skip = (validatedPage - 1) * validatedSize;

    // Construction du where clause
    const where: any = {};

    // Filtrer par utilisateur si spécifié ou si c'est un utilisateur normal
    if (userId) {
      where.userId = userId;
    }

    // Filtres additionnels
    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (networkId) {
      where.networkId = networkId;
    }

    // Filtrage par montant
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = Number(minAmount);
      }
      if (maxAmount !== undefined) {
        where.amount.lte = Number(maxAmount);
      }
    }

    // Filtrage par date
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Ajouter 23:59:59 pour inclure toute la journée
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    // Construction de l'orderBy
    const validSortFields = ['createdAt', 'amount', 'status', 'updatedAt'];
    const orderBy: any = {};
    
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc'; // Valeur par défaut
    }

    // Exécution des requêtes en parallèle
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              email: true,
            },
          },
          network: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
        orderBy,
        skip,
        take: validatedSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / validatedSize);

    return {
      data: transactions,
      pagination: {
        total,
        page: validatedPage,
        size: validatedSize,
        totalPages,
        hasNext: validatedPage < totalPages,
        hasPrev: validatedPage > 1,
      },
    };
  }

  // Méthode pour obtenir les statistiques avec filtres
  async getTransactionStats(userId?: number, filters: TransactionFilters = {}) {
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }

    // Appliquer les mêmes filtres que pour la liste
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.networkId) {
      where.networkId = filters.networkId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDateTime = new Date(filters.endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateTime;
      }
    }

    const [totalTransactions, completedTransactions, pendingTransactions, failedTransactions] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.count({ where: { ...where, status: TransactionStatus.COMPLETED } }),
      this.prisma.transaction.count({ where: { ...where, status: TransactionStatus.PENDING } }),
      this.prisma.transaction.count({ where: { ...where, status: TransactionStatus.FAILED } }),
    ]);

    const totalAmount = await this.prisma.transaction.aggregate({
      where: { ...where, status: TransactionStatus.COMPLETED },
      _sum: { amount: true },
    });

    const avgAmount = await this.prisma.transaction.aggregate({
      where: { ...where, status: TransactionStatus.COMPLETED },
      _avg: { amount: true },
    });

    return {
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      totalAmount: totalAmount._sum.amount || 0,
      averageAmount: avgAmount._avg.amount || 0,
      successRate: totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0,
    };
  }

  async create(userId: number, createTransactionDto: CreateTransactionDto){
    let clientId = createTransactionDto.clientId;
    console.log(userId)
    // const user = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // if(!user) {
    //   throw new NotFoundException('Utilisateur non trouvé');
    // }
    // Validation : soit clientId soit phoneNumber doit être fourni
    if (!clientId && !createTransactionDto.phoneNumber) {
      throw new BadRequestException('Vous devez fournir soit un ID client soit un numéro de téléphone');
    }

    // Si phoneNumber est fourni, chercher ou créer le client
    if (createTransactionDto.phoneNumber) {
      clientId = await this.findOrCreateClient(createTransactionDto);
    } else {
      // Vérifier que le client existe si clientId est fourni
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!client) {
        throw new NotFoundException('Client non trouvé');
      }
    }

    const network = await this.prisma.network.findUnique({
      where: { id: createTransactionDto.networkId },
    });

    if (!network) {
      throw new NotFoundException('Réseau non trouvé');
    }

    let mobileMoneyAccount = await this.prisma.mobileMoneyAccount.findFirst({
      where: {
        userId,
        networkId: createTransactionDto.networkId,
      },
    });

    if (!mobileMoneyAccount) {
      
      if(!createTransactionDto.phoneNumberUser) {
          throw new BadRequestException('Le numéro de téléphone de l\'utilisateur est requis pour créer un compte mobile money');
        }

      mobileMoneyAccount = await this.prisma.mobileMoneyAccount.create({
        data: {
          userId,
          networkId: createTransactionDto.networkId,
          phoneNumber: createTransactionDto.phoneNumberUser
        },
      });
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        clientId: clientId!,
        amount: createTransactionDto.amount,
        networkId: createTransactionDto.networkId,
        mobileMoneyAccountId: mobileMoneyAccount.id,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    return transaction;
  }

  private async findOrCreateClient(transactionData: CreateTransactionDto): Promise<number> {
    const { phoneNumber, firstName, lastName, email } = transactionData;

    let client = await this.prisma.client.findUnique({
      where: { phoneNumber: phoneNumber! },
    });

    if (!client) {
      const clientData: any = {
        phoneNumber: phoneNumber!,
      };

      // Ajouter les champs optionnels seulement s'ils sont définis
      if (firstName) clientData.firstName = firstName;
      if (lastName) clientData.lastName = lastName;
      if (email) clientData.email = email;

      if (email) {
        const existingClientWithEmail = await this.prisma.client.findUnique({
          where: { email },
        });

        if (existingClientWithEmail) {
          throw new BadRequestException('Un client avec cet email existe déjà');
        }
      }

      client = await this.prisma.client.create({
        data: clientData,
      });
    }

    return client.id;
  }

  // Méthode pour obtenir les suggestions de clients basées sur le numéro
  async searchClientsByPhone(phoneNumber: string, limit: number = 5) {
    return this.prisma.client.findMany({
      where: {
        phoneNumber: {
          contains: phoneNumber,
        },
      },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, userRole: UserRole, userId?: number){
    const where: any = { id };
    
    // Si l'utilisateur n'est pas admin, il ne peut voir que ses propres transactions
    if (userRole === UserRole.USER && userId) {
      where.userId = userId;
    }

    const transaction = await this.prisma.transaction.findFirst({
      where,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction non trouvée');
    }

    return transaction;
  }

  async updateStatus(id: number, status: TransactionStatus){
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction non trouvée');
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { status },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            email: true,
          },
        },
        network: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
      },
    });
  }
}