import { InvalidNameError } from '#todos/exceptions/invalid-name';

export class Name {
  private static MIN_LENGTH = 3;

  constructor(private readonly _value: string) {
    if (!_value) {
      throw new InvalidNameError(_value, `Name cannot be empty`);
    }

    if (_value.trim().length < Name.MIN_LENGTH) {
      throw new InvalidNameError(
        _value,
        `Name must be at least ${Name.MIN_LENGTH} characters long`
      );
    }
  }

  toString(): string {
    return this._value;
  }
}
