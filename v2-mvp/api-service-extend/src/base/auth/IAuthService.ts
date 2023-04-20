import { AuthorizedUser } from "./AuthorizedUser";

export interface AuthParameter {
    id: string;
    name: string;
    secret: string;
}
export interface IAuthService {
    validateUser(parameter: AuthParameter): Promise<AuthorizedUser>;
}