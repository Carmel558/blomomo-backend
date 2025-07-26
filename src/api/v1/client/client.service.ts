import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

// Type supprimé car on utilise directement les types Prisma

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createClientDto: CreateClientDto): Promise<any> {
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Correction 1: Utiliser findFirst au lieu de findUnique car phoneNumber+userId n'est pas une contrainte unique
    const existingClient = await this.prisma.client.findFirst({
      where: { 
        phoneNumber: createClientDto.phoneNumber, 
        userId: userId 
      },
    });
    
    if (existingClient) {
      throw new ConflictException('Un client avec ce numéro de téléphone existe déjà');
    }
    console.log(userId)
  
    if (createClientDto.email) {
      const existingClientWithEmail = await this.prisma.client.findUnique({
        where: { email: createClientDto.email },
      });
      
      if (existingClientWithEmail) {
        throw new ConflictException('Un client avec cet email existe déjà');
      }
    }
  
    // Correction principale: Utiliser soit la relation, soit le mode unchecked
    // Option 1: Avec relation (recommandé)
    const client = await this.prisma.client.create({
      data: {
        phoneNumber: createClientDto.phoneNumber,
        firstName: createClientDto.firstName || null,
        lastName: createClientDto.lastName || null,
        email: createClientDto.email || null,
        userId: Number(userId)
      },
    });

    return {
      data: client,
      message: 'Client créé avec succès',
      status: 201,
    }
  }

  async findAll(): Promise<any> {
    const client = await this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: client,
      message: 'Liste des clients récupérée avec succès',
      status: 200,
    };
  }

  async findOne(id: number): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    return {
      data: client,
      message: 'Client trouvé avec succès',
      status: 200,
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    const client = await this.prisma.client.findMany({
      where: { phoneNumber },
    });

    // Correction 4: Vérifier la longueur du tableau au lieu de null
    if (client.length === 0) {
      throw new NotFoundException(`Client avec le numéro de téléphone ${phoneNumber} non trouvé`);
    }

    return {
      data: client,
      message: 'Client trouvé avec succès',
      status: 200,
    };
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<any> {
    // Correction 5: Récupérer directement les données du client
    const existingClient = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    if (updateClientDto.phoneNumber && updateClientDto.phoneNumber !== existingClient.phoneNumber) {
      const clientWithSamePhone = await this.prisma.client.findFirst({
        where: { 
          phoneNumber: updateClientDto.phoneNumber, 
          userId: existingClient.userId,
          NOT: { id: id } // Exclure le client actuel
        },
      });

      if (clientWithSamePhone) {
        throw new ConflictException('Un client avec ce numéro de téléphone existe déjà');
      }
    }

    if (updateClientDto.email && updateClientDto.email !== existingClient.email) {
      const clientWithSameEmail = await this.prisma.client.findFirst({
        where: { 
          email: updateClientDto.email,
          NOT: { id: id } // Exclure le client actuel
        },
      });

      if (clientWithSameEmail) {
        throw new ConflictException('Un client avec cet email existe déjà');
      }
    }

    const clientUpdate = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });

    return {
      data: clientUpdate,
      message: 'Client mis à jour avec succès',
      status: 200,
    }
  }

  async remove(id: number): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    // Vérifier si le client a des transactions
    const transactionCount = await this.prisma.transaction.count({
      where: { clientId: id },
    });

    if (transactionCount > 0) {
      throw new ConflictException('Impossible de supprimer un client ayant des transactions');
    }

    await this.prisma.client.delete({
      where: { id },
    });

    return {
      data: client,
      message: 'Client supprimé avec succès',
      status: 200,
    }
  }

  async search(query: string): Promise<any> {
    const client = await this.prisma.client.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: client,
      message: 'Résultats de la recherche récupérés avec succès',
      status: 200,
    };
  }
}