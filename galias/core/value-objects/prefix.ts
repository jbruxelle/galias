import { isVite } from "../../utils/bundler";

export class Prefix {
  private static readonly ALLOWED_CHARACTERS = ["#", "$", "@"];

  constructor(
    private readonly _value: (typeof Prefix.ALLOWED_CHARACTERS)[number],
  ) {
    this._validate();
  }

  get value(): string {
    return this._value;
  }

  private _validate(): void {
    if (!isVite()) return;
    if (this.value === "@") {
      throw new Error(`The prefix "${this.value}" is not allowed in Vite.`);
    }
  }
}
