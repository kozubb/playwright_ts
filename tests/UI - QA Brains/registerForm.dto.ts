export type RegistersDto = RegisterDto[];

export interface RegisterDto {
    name: string;
    country: string;
    accountType: string;
    email: string;
    password: string;
}