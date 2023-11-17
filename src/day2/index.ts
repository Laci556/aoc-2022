import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<[number, number][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input.split('\n').map((line) => {
      const [a, b] = line.split(' ');
      return ['ABC'.indexOf(a), 'XYZ'.indexOf(b)];
    }),
  silver: (input) =>
    input.reduce(
      (prev, [a, b]) =>
        prev + b + 1 + ((a + 1) % 3 === b ? 6 : a === b ? 3 : 0),
      0
    ),
  gold: (input) =>
    input.reduce(
      (prev, [a, b]) => prev + b * 3 + (((a + b - 1 + 3) % 3) + 1),
      0
    ),
};

export default challenge;
