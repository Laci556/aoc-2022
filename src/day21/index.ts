import { join } from 'path';
import { Challenge } from '../challenges';

type M = Record<string, [string, '+' | '-' | '*' | '/', string] | number>;

const calculate = (name: string, monkeys: M): number => {
  const m = monkeys[name];
  if (typeof m === 'number') return m;
  const [a, b, c] = m;
  switch (b) {
    case '+':
      return calculate(a, monkeys) + calculate(c, monkeys);
    case '-':
      return calculate(a, monkeys) - calculate(c, monkeys);
    case '*':
      return calculate(a, monkeys) * calculate(c, monkeys);
    case '/':
      return calculate(a, monkeys) / calculate(c, monkeys);
  }
};

const challenge: Challenge<M> = {
  inputPath: join(__dirname, './test.txt'),
  processInput: (input) =>
    input.split('\n').reduce((obj, row) => {
      const [name, value] = row.split(': ');
      return {
        ...obj,
        [name]:
          value.split(' ').length === 1
            ? +value
            : (value.split(' ') as M[string]),
      };
    }, {} as M),
  silver: (input) => {
    return calculate('root', input);
  },
  // gold: (input) => {},
};

export default challenge;
