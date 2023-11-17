import { join } from 'path';
import { Challenge } from '../challenges';

type Move = { from: number; to: number; crates: number };

const challenge: Challenge<
  {
    stacks: string[][];
    moves: Move[];
  },
  string
> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => {
    const [position, steps] = input.split('\n\n');
    const posLines = position.split('\n');
    const stacks = new Array((posLines[0].length + 1) / 4)
      .fill(0)
      .map(() => [] as string[]);
    for (let i = 0; i < posLines.length - 1; i++) {
      for (let j = 1; j < posLines[i].length; j += 4) {
        if (posLines[i][j] !== ' ') {
          stacks[(j - 1) / 4].push(posLines[i][j]);
        }
      }
    }
    const moves: Move[] = [];
    for (let move of steps.split('\n')) {
      const [crates, from, to] = move.match(/\d+/g)!.map(Number);
      moves.push({ crates, from, to });
    }
    return { stacks, moves };
  },
  silver: ({ stacks: inputStacks, moves }) => {
    const stacks = inputStacks.map((s) => [...s]);
    for (let move of moves) {
      const crates = stacks[move.from - 1].splice(0, move.crates);
      stacks[move.to - 1] = [...crates.reverse(), ...stacks[move.to - 1]];
    }
    return stacks.map(([s]) => s ?? '').join('');
  },
  gold: ({ stacks: inputStacks, moves }) => {
    const stacks = inputStacks.map((s) => [...s]);
    for (let move of moves) {
      const crates = stacks[move.from - 1].splice(0, move.crates);
      stacks[move.to - 1] = [...crates, ...stacks[move.to - 1]];
    }
    return stacks.map(([s]) => s ?? '').join('');
  },
};

export default challenge;
