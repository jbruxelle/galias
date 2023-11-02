export interface AuthenticationGateway {
  login(email: string, password: string): Promise<string>;
}
