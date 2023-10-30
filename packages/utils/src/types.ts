export type Prettify<T> = {
  [key in keyof T]: T[key];
} & {};

export type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };
