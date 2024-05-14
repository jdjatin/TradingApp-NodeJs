export enum Role {
    Admin = 'admin',
    Customer = 'customer'
}

type Customer = {
    id: string;
    email: string;
    password: string;
    role: Role;
}

export interface IAuthenticate {
    readonly customer: Customer;
    readonly token: string;
}