import { join } from 'path';
import { Challenge } from '../challenges';

const getHeight = (cell: string) => {
  return cell === 'E'
    ? 25
    : cell === 'S'
    ? 0
    : (cell?.charCodeAt(0) ?? Infinity) - 97;
};
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const challenge: Challenge<string[][]> = {
  inputPath: join(__dirname, './day12.txt'),
  processInput: (input) => input.split('\n').map((row) => [...row]),
  silver: (input) => {
    const distances = new Array<number>(input.length * input[0].length).fill(
      Infinity
    );
    const start = input.flat().indexOf('S');
    const queue = [start];
    const end = input.flat().indexOf('E');
    const parents = new Array<number>(input.length * input[0].length).fill(
      Infinity
    );
    distances[start] = 0;
    parents[start] = 0;
    while (queue.length !== 0) {
      const current = queue.shift()!;
      if (current === end) break;
      const row = Math.floor(current / input[0].length),
        col = current % input[0].length;
      for (const [x, y] of directions) {
        const nRow = row + x,
          nCol = col + y;
        const cell = input.at(nRow)?.at(nCol);
        const height = getHeight(cell || 'z');
        if (
          nRow < 0 ||
          nRow >= input.length ||
          nCol < 0 ||
          nCol >= input[0].length ||
          height - getHeight(input[row][col]) > 1
        )
          continue;
        const neighbor = nRow * input[0].length + nCol;
        if (distances[neighbor] === Infinity) {
          distances[neighbor] = distances[current] + 1;
          queue.push(neighbor);
          parents[neighbor] = current;
        }
      }
    }
    let parent = end;
    const graph: string[][] = new Array(input.length)
      .fill(0)
      .map(() => new Array(input[0].length).fill('.'));
    while (parent !== 0) {
      const row = Math.floor(parent / input[0].length),
        col = parent % input[0].length;
      graph[row][col] = input[row][col];
      parent = parents[parent];
    }
    console.log(graph.map((line) => line.join('')).join('\n'));
    return distances[end];
  },
  gold: (input) => {
    const distances = new Array<number>(input.length * input[0].length).fill(
      Infinity
    );
    const start = input.flat().indexOf('E');
    const queue = [start];

    distances[start] = 0;
    while (queue.length !== 0) {
      const current = queue.shift()!;
      const row = Math.floor(current / input[0].length),
        col = current % input[0].length;
      if ('aS'.includes(input[row][col])) return distances[current];

      for (const [x, y] of directions) {
        const nRow = row + x,
          nCol = col + y;
        const cell = input.at(nRow)?.at(nCol);
        const height = getHeight(cell || 'z');
        if (
          nRow < 0 ||
          nRow >= input.length ||
          nCol < 0 ||
          nCol >= input[0].length ||
          getHeight(input[row][col]) - height > 1
        )
          continue;
        const neighbor = nRow * input[0].length + nCol;
        if (distances[neighbor] === Infinity) {
          distances[neighbor] = distances[current] + 1;
          queue.push(neighbor);
        }
      }
    }
    return 0;
  },
};

export default challenge;
