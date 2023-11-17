import { join } from 'path';
import { Challenge } from '../challenges';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const rocks = [
  [[true, true, true, true]],
  [
    [false, true, false],
    [true, true, true],
    [false, true, false],
  ],
  [
    [false, false, true],
    [false, false, true],
    [true, true, true],
  ],
  [[true], [true], [true], [true]],
  [
    [true, true],
    [true, true],
  ],
] as const;

const checkVerticalCollision = (
  [row, col]: [number, number],
  rock: ArrayElement<typeof rocks>,
  fallenRocks: boolean[][]
) => {
  for (let i = rock.length - 1; i >= 0; i--) {
    for (let j = 0; j < rock[i].length; j++) {
      const under = row - rock.length + i + 2;
      if (
        rock[i][j] &&
        (under === fallenRocks.length ||
          (under >= 0 && fallenRocks[under][col + j]))
      ) {
        return true;
      }
    }
  }
  return false;
};

const checkHorizontalCollision = (
  [row, col]: [number, number],
  rock: ArrayElement<typeof rocks>,
  fallenRocks: boolean[][],
  direction: string
) => {
  for (let i = rock.length - 1; i >= 0; i--) {
    for (let j = 0; j < rock[i].length; j++) {
      const pieceRow = row - rock.length + i + 1;
      const newCol = col + j + (direction === '<' ? -1 : +1);
      if (
        rock[i][j] &&
        (newCol < 0 ||
          newCol >= 7 ||
          (pieceRow >= 0 && fallenRocks[pieceRow][newCol]))
      ) {
        return true;
      }
    }
  }
  return false;
};

const emptyRow = [false, false, false, false, false, false, false];

const challenge: Challenge<string> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => input,
  silver: (input) => {
    console.log('length of winds: ' + input.length);
    let fallenRocks: boolean[][] = [];
    let j = 0;
    for (let i = 0; i < 1000000000000; i++) {
      const rock = rocks[i % rocks.length];
      let rockPos: [number, number] = [-4, 2];
      while (true) {
        const wind = input[j++ % input.length];
        if (!checkHorizontalCollision(rockPos, rock, fallenRocks, wind)) {
          rockPos[1] += wind === '<' ? -1 : +1;
        }
        if (!checkVerticalCollision(rockPos, rock, fallenRocks)) {
          rockPos[0]++;
        } else {
          const originalHeight = fallenRocks.length;
          const newRowCount = Math.max(0, rock.length - rockPos[0] - 1);
          fallenRocks = [
            ...new Array<boolean[]>(newRowCount)
              .fill([])
              .map(() => [...emptyRow]),
            ...fallenRocks,
          ];
          const height = fallenRocks.length;
          for (let rockRow = 0; rockRow < rock.length; rockRow++) {
            for (let rockCol = 0; rockCol < rock[rockRow].length; rockCol++) {
              if (rock[rockRow][rockCol]) {
                fallenRocks[
                  height -
                    originalHeight +
                    rockPos[0] -
                    (rock.length - rockRow - 1)
                ][rockPos[1] + rockCol] = true;
              }
            }
          }
          if (fallenRocks.length % 2 === 0) {
            let repeat = true;
            for (let i = 0; i < fallenRocks.length / 2; i++) {
              repeat =
                repeat &&
                fallenRocks[i].every(
                  (v, idx) => v === fallenRocks[i + fallenRocks.length / 2][idx]
                );
              if (!repeat) break;
            }
            if (repeat) {
              console.log('repeat', i);
              console.log(
                fallenRocks
                  .map((f) =>
                    ['|', ...f.map((v) => (v ? '#' : ' ')), '|'].join('')
                  )
                  .join('\n')
              );
              console.log('\n');
              return 0;
            }
          }
          break;
        }
      }
    }
    return fallenRocks.length;
  },
  // gold: (input) => {},
};

export default challenge;
