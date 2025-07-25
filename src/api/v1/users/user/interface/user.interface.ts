import { User } from "@prisma/client";

export interface IUser extends Omit<User, "password"> {}
