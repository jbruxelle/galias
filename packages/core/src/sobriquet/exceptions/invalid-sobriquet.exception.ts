export class InvalidSobriquetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSobriquetError';
  }
}
