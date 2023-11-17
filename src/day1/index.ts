import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<number[]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input: string) =>
    input
      .split('\n\n')
      .map((line) => line.split('\n').reduce((a, b) => a + Number(b), 0)),

  silver: (input) => Math.max(...input),
  gold: (input) =>
    input
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b),
};

export default challenge;
