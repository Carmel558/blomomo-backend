import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiAcceptedResponse, ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserBusiness } from "./user.business";
import { UserResponseDto } from "./dto/user-response.dto";
import { ListUserQueryDto } from "./dto/list-user-query.dto";
import { CreateUserQueryDto } from "./dto/create-user-query.dto";
import { UpdateUserQueryDto } from "./dto/update-user-query.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserType } from "src/common/enums/user-type.enum";

@ApiTags("Users Management")
@Controller()
@ApiBearerAuth()
export class userController {
  constructor(private readonly userBusiness: UserBusiness) {}

  @Get("users")
  @HttpCode(HttpStatus.OK)
  @ApiAcceptedResponse({
    description: "Get all users.",
    type: UserResponseDto,
    isArray: true,
  })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "order", required: false })
  @ApiQuery({ name: "skip", required: false })
  @ApiQuery({ name: "take", required: false })
  async listUsers(
    @Query() query: ListUserQueryDto
  ): Promise<UserResponseDto[]> {
    return this.userBusiness.listUsers(query);
  }

  @HttpCode(HttpStatus.OK)
  @ApiAcceptedResponse({
    description: "Get specifique user.",
    type: UserResponseDto,
    isArray: false,
  })
  @Get("users/:id")
  async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userBusiness.getUserById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({
    description: "Create user sub_admin and delevery_person by admin.",
    type: UserResponseDto,
    isArray: false,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ADMIN)
  @Post("users")
  async createUser(@Body() body: CreateUserQueryDto,): Promise<UserResponseDto> {
    return this.userBusiness.createUser(body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiAcceptedResponse({
    description: "Update user.",
    type: UserResponseDto,
    isArray: false,
  })
  @Put("users/:id")
  async updateUser(
    id: number,
    @Body() body: UpdateUserQueryDto
  ): Promise<UserResponseDto> {
    return this.userBusiness.updateUser(id, body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiAcceptedResponse({
    description: "Delete user.",
    type: UserResponseDto,
    isArray: false,
  })
  @Delete("users/:id")
  async deleteUser(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userBusiness.deleteUser(id);
  }
}
