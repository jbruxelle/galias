export class InvalidSobriquetPathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSobriquetPathError';
  }
}
