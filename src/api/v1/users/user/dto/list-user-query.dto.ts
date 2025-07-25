import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsInt, IsOptional, IsString, MaxLength } from "class-validator";
import { STRING_MAX_SIZE } from "src/shared/resources/validator.resources";

export class ListUserQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(STRING_MAX_SIZE)
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  @ApiPropertyOptional()
  order?: "asc" | "desc";

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  skip?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional()
  take?: number;
}
