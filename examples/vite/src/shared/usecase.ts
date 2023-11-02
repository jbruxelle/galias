export interface UseCase<RequestModel = object, ResponseModel = void> {
  execute(request: RequestModel): Promise<ResponseModel>;
}
