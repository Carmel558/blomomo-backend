import { CreateUserQueryDto } from "./dto/create-user-query.dto";
import { Prisma } from "@prisma/client";
import { ListUserQueryDto } from "./dto/list-user-query.dto";
import { IUser } from "./interface/user.interface";
import { PrismaService } from "src/shared/prisma/prisma.service";
// import { unaccent } from "src/shared/helper/general.helper";
import { UpdateUserQueryDto } from "./dto/update-user-query.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(params: Partial<ListUserQueryDto>): Promise<IUser[]> {
    // const searchTerm = params.search
    //   ? unaccent(params.search).trim()
    //   : undefined;
    const users = await this.prisma.user.findMany({
      where: {
        // OR: [
        //   {
        //     firstName: {
        //       contains: searchTerm,
        //       mode: "insensitive",
        //     },
        //   },
        //   {
        //     lastName: {
        //       contains: searchTerm,
        //       mode: "insensitive",
        //     },
        //   },
        // ],
      },
      orderBy: {
        createdAt: params.order || Prisma.SortOrder.desc,
      },
    });

    return users;
  }

  async getUserById(id: number): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return user;
  }

  async createUser(request: CreateUserQueryDto): Promise<IUser> {
    // On suppose que la vérification ADMIN est faite ailleurs (ex: guard ou controller)
    // On vérifie que le type est bien SUB_ADMIN ou DELIVERY_PERSON
    if (!request.userType || (request.userType !== 'SUB_ADMIN' && request.userType !== 'ADMIN')) {
      throw new Error('Seuls les utilisateurs SUB_ADMIN ou DELIVERY_PERSON peuvent être créés par cette méthode.');
    }
    const user = await this.prisma.user.create({
      data: {
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        password: request.password,
        phoneNumber: request.phone,
        role: request.userType,
      },
    });
    return user;
  }

  async updateUser(id: number, request: UpdateUserQueryDto): Promise<IUser> {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        password: request.password,
        phoneNumber: request.phone,
      },
    });

    return user;
  }

  async deleteUser(id: number): Promise<IUser> {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return user;
  }
}
