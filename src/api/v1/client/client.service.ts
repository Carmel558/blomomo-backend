import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';


type CreateClientData = {
  phoneNumber: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto): Promise<any> {
    const existingClient = await this.prisma.client.findUnique({
      where: { phoneNumber: createClientDto.phoneNumber },
    });
    
    if (existingClient) {
      throw new ConflictException('Un client avec ce numéro de téléphone existe déjà');
    }
  
    if (createClientDto.email) {
      const existingClientWithEmail = await this.prisma.client.findUnique({
        where: { email: createClientDto.email },
      });
      
      if (existingClientWithEmail) {
        throw new ConflictException('Un client avec cet email existe déjà');
      }
    }
  
    
  
    const clientData: CreateClientData = {
      phoneNumber: createClientDto.phoneNumber,
      firstName: createClientDto.firstName || null,
      lastName: createClientDto.lastName || null,
      email: createClientDto.email || null,
    };
  
    return this.prisma.client.create({
      data: clientData,
    });
  }

  async findAll(): Promise<any> {
    return this.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<any> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${id} non trouvé`);
    }

    return client;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<any> {
    return this.prisma.client.findUnique({
      where: { phoneNumber },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<any> {
    const client = await this.findOne(id);

    if (updateClientDto.phoneNumber && updateClientDto.phoneNumber !== client.phoneNumber) {
      const existingClient = await this.prisma.client.findUnique({
        where: { phoneNumber: updateClientDto.phoneNumber },
      });

      if (existingClient) {
        throw new ConflictException('Un client avec ce numéro de téléphone existe déjà');
      }
    }

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existingClientWithEmail = await this.prisma.client.findUnique({
        where: { email: updateClientDto.email },
      });

      if (existingClientWithEmail) {
        throw new ConflictException('Un client avec cet email existe déjà');
      }
    }

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

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
  }

  async search(query: string): Promise<any> {
    return this.prisma.client.findMany({
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
  }
}