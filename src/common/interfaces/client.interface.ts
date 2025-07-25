export interface IClient {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
}

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