import { Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserQueryDto } from "./dto/create-user-query.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { ListUserQueryDto } from "./dto/list-user-query.dto";
import { UpdateUserQueryDto } from "./dto/update-user-query.dto";

@Injectable()
export class UserBusiness {
  constructor(private readonly userService: UserService) {}

  async listUsers(query: ListUserQueryDto): Promise<UserResponseDto[]> {
    const users = await this.userService.listUsers(query);
    return users.map((user) => new UserResponseDto(user));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(+id);
    return new UserResponseDto(user);
  }

  async createUser(request: CreateUserQueryDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(request);
    return new UserResponseDto(user);
  }

  async updateUser(
    id: number,
    request: UpdateUserQueryDto
  ): Promise<UserResponseDto> {
    const user = await this.userService.updateUser(id, request);
    return new UserResponseDto(user);
  }

  async deleteUser(id: number): Promise<UserResponseDto> {
    const user = await this.userService.deleteUser(+id);
    return new UserResponseDto(user);
  }
}
