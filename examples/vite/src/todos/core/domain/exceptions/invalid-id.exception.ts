export class InvalidIDError extends Error {
  constructor(id: string, message: string) {
    super([`Invalid ID: [${id}]`, message].join('\n'));
    this.name = 'InvalidIDError';
  }
}
