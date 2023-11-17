import { join } from 'path';
import { Challenge } from '../challenges';

type Monkey = {
  items: number[];
  operation: (old: number) => number;
  test: (worry: number) => number;
  divideBy: number;
};

const monkeyBusiness = (
  _monkeys: Monkey[],
  rounds: number,
  divide: boolean
) => {
  const monkeys = _monkeys.map((monkey) => ({
    ...monkey,
    items: [...monkey.items],
  }));
  const modulus = monkeys.reduce((prod, monkey) => prod * monkey.divideBy, 1);
  const inspections = new Array<number>(monkeys.length).fill(0);
  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      const monkey = monkeys[j];

      while (!!monkey.items.length) {
        const newWorry = Math.floor(
          monkey.operation(monkey.items.shift()!) / (divide ? 3 : 1)
        );
        monkeys[monkey.test(newWorry)].items.push(newWorry % modulus);
        inspections[j]++;
      }
    }
  }
  inspections.sort((a, b) => b - a);
  return inspections[0] * inspections[1];
};

const challenge: Challenge<Monkey[]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (_input) => {
    const input = _input.split('\n').map((line) => line.trim());
    const monkeys: Monkey[] = [];
    for (let i = 0; i < input.length; i += 7) {
      monkeys.push({
        items: input[i + 1]
          .replace('Starting items: ', '')
          .split(', ')
          .map(Number),
        operation: (old) => {
          const f = new Function(
            'old',
            `const ${input[i + 2]
              .replace('Operation: ', '')
              .replace('new', 'worry')}; return worry`
          );
          return f(old) as number;
        },
        test: (worry) =>
          0 === worry % Number(input[i + 3].match(/\d+/)![0])
            ? Number(input[i + 4].match(/\d+/)![0])
            : Number(input[i + 5].match(/\d+/)![0]),
        divideBy: Number(input[i + 3].match(/\d+/)![0]),
      });
    }
    return monkeys;
  },
  silver: (monkeys) => monkeyBusiness(monkeys, 20, true),
  gold: (monkeys) => monkeyBusiness(monkeys, 10_000, false),
};

export default challenge;
