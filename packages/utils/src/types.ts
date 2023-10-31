export type Prettify<T> = { [key in keyof T]: T[key] } & object;

export type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] };
