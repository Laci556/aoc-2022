import { join } from 'path';
import { Challenge } from '../challenges';

const print = (cave: string[][]) => {
  console.log(cave.map((row) => row.join('')).join('\n'));
};

const challenge: Challenge<{ cave: string[][]; startCol: number }> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => {
    const walls = input
      .split('\n')
      .map((wall) =>
        wall
          .split(' -> ')
          .map((segment) => segment.split(',').map(Number) as [number, number])
      );
    const height = Math.max(...walls.flat().map((s) => s[1])) + 2;
    const minX = 500 - height + 1;
    const cave = new Array<string[]>(height)
      .fill([])
      .map(() => new Array<string>(height * 2 - 1).fill('.'));
    for (let wall of walls) {
      for (let i = 1; i < wall.length; i++) {
        const [col1, row1] = wall[i - 1],
          [col2, row2] = wall[i];

        if (col1 === col2) {
          for (let j = Math.min(row1, row2); j <= Math.max(row1, row2); j++) {
            cave[j][col1 - minX] = '#';
          }
        } else {
          for (
            let j = Math.min(col1, col2) - minX;
            j <= Math.max(col1, col2) - minX;
            j++
          ) {
            cave[row1][j] = '#';
          }
        }
      }
    }
    return { cave, startCol: minX };
  },
  silver: ({ cave: _cave, startCol }) => {
    const cave = _cave.map((row) => [...row]);
    let sand = 0;
    while (true) {
      let row = 0,
        col = 500 - startCol;
      while (true) {
        // overflow
        if (row >= cave.length - 1 || col < 0 || col >= cave[0].length) {
          print(cave);
          return sand;
        }
        row++;

        // rest
        if (
          [cave[row][col - 1], cave[row][col], cave[row][col + 1]].every(
            (space) => 'o#'.includes(space)
          )
        ) {
          cave[row - 1][col] = 'o';
          break;
        }

        // fall
        if (cave[row][col] === '.') {
          // fall down
        } else if (col === 0 || cave[row][col - 1] === '.') {
          col--;
        } else {
          col++;
        }
      }
      sand++;
    }
  },
  gold: ({ cave: _cave, startCol }) => {
    const cave = _cave.map((row) => [...row]);
    let sand = 0;
    while (true) {
      let row = 0,
        col = 500 - startCol;
      while (true) {
        row++;

        // rest
        if (
          row === cave.length ||
          [cave[row][col - 1], cave[row][col], cave[row][col + 1]].every(
            (space) => 'o#'.includes(space)
          )
        ) {
          cave[row - 1][col] = 'o';
          if (row === 1) {
            print([
              ...cave.map((row) => [
                ...row
                  .join('')
                  .padStart(row.length + 1, '.')
                  .padEnd(row.length + 2, '.'),
              ]),
              [...'#'.repeat(cave[0].length + 2)],
            ]);
            return sand + 1;
          }
          break;
        }

        // fall
        if (cave[row][col] === '.') {
          // fall down
        } else if (cave[row][col - 1] === '.') {
          col--;
        } else {
          col++;
        }
      }
      sand++;
    }
  },
};

export default challenge;
