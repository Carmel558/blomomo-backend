export interface IClient {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateClientData = {
  phoneNumber: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  userId: number; 
};

export interface ICreateClient {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
}

export interface IUpdateClient {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
}