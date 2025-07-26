import { UserRole } from "@prisma/client";

export interface JwtPayload {
  sub: number;
  email: string;
  userType: UserRole;
  phoneNumber: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    userType: UserRole;
    phoneNumber: string | null;
  };
}

export interface AuthResponseAdmin {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    userType: UserRole;
    phoneNumber?: string | null;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
} 