import { UseCase } from '#shared/usecase';
import { AuthenticationGateway } from '#authentication/gateways/authentication';
import { LoginRequest } from '#authentication/login/request-model';
import { LoginResponse } from '#authentication/login/response-model';

export class LoginUseCase implements UseCase<LoginRequest, LoginResponse> {
  constructor(private readonly _gateway: AuthenticationGateway) {}

  async execute({ email, password }: LoginRequest): Promise<LoginResponse> {
    return await this._gateway.login(email, password);
  }
}
