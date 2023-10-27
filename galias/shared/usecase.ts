export interface Usecase<UsecaseInput, UsecaseOutput> {
  execute(input: UsecaseInput): Promise<UsecaseOutput>;
}
