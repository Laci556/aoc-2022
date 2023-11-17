import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<[[number, number], [number, number]][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input.split('\n').map((line) => {
      const [a, b, c, d] = line.split(/,|\-/).map(Number);
      return [
        [a, b],
        [c, d],
      ];
    }),
  silver: (input) =>
    input.filter(([[a, b], [c, d]]) => (a <= c && b >= d) || (a >= c && b <= d))
      .length,
  gold: (input) =>
    input.filter(([[a, b], [c, d]]) => (c >= a && c <= b) || (a >= c && a <= d))
      .length,
};

export default challenge;
