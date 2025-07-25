export interface INetwork {
    id: number;
    name: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateNetwork {
    name: string;
    image?: string;
}

export interface IUpdateNetwork {
    name?: string;
    image?: string;
}