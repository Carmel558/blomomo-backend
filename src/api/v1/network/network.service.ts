// src/network/network.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';

@Injectable()
export class NetworkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNetworkDto: CreateNetworkDto): Promise<any> {
    const existingNetwork = await this.prisma.network.findUnique({
      where: { name: createNetworkDto.name },
    });

    if (existingNetwork) {
      throw new ConflictException('Un réseau avec ce nom existe déjà');
    }

   const network = await this.prisma.network.create({
      data: createNetworkDto,
    });

    return {
      data: network,
      status: 201,
      message: 'Réseau créé avec succès',
    }
  }

  async findAll(): Promise<any> {
    const network = await this.prisma.network.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      data: network,
      status: 200,
      message: 'Liste des réseaux récupérée avec succès',
    };

  }

  async findOne(id: number): Promise<any> {
    const network = await this.prisma.network.findUnique({
      where: { id },
    });

    if (!network) {
      throw new NotFoundException(`Réseau avec l'ID ${id} non trouvé`);
    }

    return {
      data: network,
      status: 200,
      message: 'Réseau récupéré avec succès',
    };
  }

  async update(id: number, updateNetworkDto: UpdateNetworkDto): Promise<any> {
    const network = await this.findOne(id);

    if (updateNetworkDto.name && updateNetworkDto.name !== network.name) {
      const existingNetwork = await this.prisma.network.findUnique({
        where: { name: updateNetworkDto.name },
      });

      if (existingNetwork) {
        throw new ConflictException('Un réseau avec ce nom existe déjà');
      }
    }

    const networkUpdate= await this.prisma.network.update({
      where: { id },
      data: updateNetworkDto,
    });

    return {
      data: networkUpdate,
      status: 200,
      message: 'Réseau mis à jour avec succès',
    }
  }

  async remove(id: number){
    const network = await this.findOne(id);

    // Vérifier si le réseau a des comptes mobile money ou des transactions
    const [mobileMoneyAccountCount, transactionCount] = await Promise.all([
      this.prisma.mobileMoneyAccount.count({ where: { networkId: id } }),
      this.prisma.transaction.count({ where: { networkId: id } }),
    ]);

    if (mobileMoneyAccountCount > 0 || transactionCount > 0) {
      throw new ConflictException(
        'Impossible de supprimer un réseau ayant des comptes ou des transactions associés'
      );
    }

    await this.prisma.network.delete({
      where: { id },
    });

    return {
      data: network,
      message: 'Réseau supprimé avec succès',
      status: 200,
    }
  }

  async getNetworkStats(id: number) {
    const network = await this.findOne(id);

    const [mobileMoneyAccountCount, transactionCount, totalAmount] = await Promise.all([
      this.prisma.mobileMoneyAccount.count({ where: { networkId: id } }),
      this.prisma.transaction.count({ where: { networkId: id } }),
      this.prisma.transaction.aggregate({
        where: { 
          networkId: id,
          status: 'COMPLETED'
        },
        _sum: { amount: true }
      })
    ]);

    return {
      network,
      stats: {
        mobileMoneyAccounts: mobileMoneyAccountCount,
        totalTransactions: transactionCount,
        totalAmount: totalAmount._sum.amount || 0,
      }
    };
  }
}