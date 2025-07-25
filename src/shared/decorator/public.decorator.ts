import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { METADATA_KEY_PUBLIC } from "../../management/auth/resources/auth.resources";

export const Public = (): CustomDecorator =>
  SetMetadata(METADATA_KEY_PUBLIC, true);
