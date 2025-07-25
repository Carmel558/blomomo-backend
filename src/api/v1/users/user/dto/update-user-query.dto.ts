import { PartialType } from "@nestjs/swagger";
import { CreateUserQueryDto } from "./create-user-query.dto";

export class UpdateUserQueryDto extends PartialType(CreateUserQueryDto) {}
