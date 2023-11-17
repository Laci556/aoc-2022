import { join } from 'path';
import { Challenge } from '../challenges';

const solve = (s: string, len: number) =>
  new Array(s.length - len + 1)
    .fill(0)
    .map((_, i) => [...new Set(s.slice(i, i + len))])
    .findIndex((val) => val.length === len);

const challenge: Challenge<string> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => input,
  silver: (input) => solve(input, 4),
  gold: (input) => solve(input, 14),
};

export default challenge;
