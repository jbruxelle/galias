import { InvalidIDError } from '#shared/exceptions/invalid-id.exception';

export class ID {
  private static MIN_LENGTH = 5;

  constructor(private readonly _value: string) {
    if (_value.length < ID.MIN_LENGTH) {
      throw new InvalidIDError(
        _value,
        `ID must be at least ${ID.MIN_LENGTH} characters long`
      );
    }
  }

  toString(): string {
    return this._value;
  }
}
