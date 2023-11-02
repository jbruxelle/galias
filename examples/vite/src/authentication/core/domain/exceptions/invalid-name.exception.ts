export class InvalidNameError extends Error {
  constructor(text: string, message: string) {
    super([`Invalid Name: [${text}]`, message].join('\n'));
    this.name = 'InvalidNameError';
  }
}
