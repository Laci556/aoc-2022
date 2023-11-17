import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<number[]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (_input) => {
    const input = _input.split('\n').map((line) => ({
      instruction: line.split(' ')[0],
      x: +line.split(' ')[1],
    }));
    const xVal: number[] = [1];
    for (let i = 0; i < input.length; i++) {
      if (input[i].instruction === 'noop') {
        xVal.push(xVal[xVal.length - 1]);
      } else {
        xVal.push(xVal[xVal.length - 1]);
        xVal.push(input[i].x! + xVal[xVal.length - 1]);
      }
    }
    return xVal;
  },
  silver: (input) =>
    [20, 60, 100, 140, 180, 220]
      .map((c) => input[c - 1] * c)
      .reduce((a, b) => a + b),
  gold: (input) => {
    const display = new Array(6).fill(0).map((_) => new Array(40).fill('.'));
    for (let i = 0; i < input.length - 1; i++) {
      const row = Math.floor(i / 40),
        col = i % 40;
      const x = input[i];
      display[row][col] = Math.abs(x - col) <= 1 ? '#' : '.';
    }
    console.log();
    console.log(display.map((row) => row.join('')).join('\n'));
    console.log();
    return 0;
  },
};

export default challenge;
