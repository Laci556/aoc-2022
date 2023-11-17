export type Challenge<T = any, Result extends number | string = number> = {
  inputPath: string;
  processInput: (input: string) => T;
  silver?: (param: T) => Result;
  gold?: (param: T) => Result;
};
