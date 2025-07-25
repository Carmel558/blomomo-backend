import { TransactionStatus } from '@prisma/client';

export interface ITransaction {
  id: number;
  userId: number;
  clientId: number;
  amount: number;
  status: TransactionStatus;
  networkId: number;
  mobileMoneyAccountId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTransaction {
  userId: number;
  clientId: number;
  amount: number;
  networkId: number;
  mobileMoneyAccountId?: number;
}

export interface ITransactionWithRelations extends ITransaction {
  client?: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  network?: {
    id: number;
    name: string;
    image?: string;
  };
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
  };
}