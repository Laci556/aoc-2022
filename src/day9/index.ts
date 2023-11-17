import { join } from 'path';
import { Challenge } from '../challenges';

const dist = (a: number, b: number) => Math.abs(a - b);
const moveKnot = (
  hPos: [number, number],
  tPos: [number, number]
): [number, number] => [
  dist(hPos[0], tPos[0]) > 1 ||
  (dist(hPos[1], tPos[1]) > 1 && hPos[0] !== tPos[0])
    ? tPos[0] + (hPos[0] > tPos[0] ? 1 : -1)
    : tPos[0],
  dist(hPos[1], tPos[1]) > 1 ||
  (dist(hPos[0], tPos[0]) > 1 && hPos[1] !== tPos[1])
    ? tPos[1] + (hPos[1] > tPos[1] ? 1 : -1)
    : tPos[1],
];

const challenge: Challenge<['U' | 'D' | 'L' | 'R', number][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input
      .split('\n')
      .map((row) => [
        row.split(' ')[0] as 'U' | 'D' | 'L' | 'R',
        +row.split(' ')[1],
      ]),
  silver: (input) => {
    let hPos: [number, number] = [0, 0],
      tPos: [number, number] = [0, 0];
    const visited = [tPos];
    for (const [direction, count] of input) {
      for (let i = 0; i < count; i++) {
        hPos[0] += direction === 'R' ? 1 : direction === 'L' ? -1 : 0;
        hPos[1] += direction === 'D' ? 1 : direction === 'U' ? -1 : 0;
        tPos = moveKnot(hPos, tPos);
        if (!visited.some((pos) => pos[0] === tPos[0] && pos[1] === tPos[1]))
          visited.push(tPos);
      }
    }
    return visited.length;
  },
  gold: (input) => {
    const knots: [number, number][] = new Array(10).fill(0).map(() => [0, 0]);
    const visited = [[0, 0]];
    for (const [direction, count] of input) {
      for (let i = 0; i < count; i++) {
        knots[0][0] += direction === 'R' ? 1 : direction === 'L' ? -1 : 0;
        knots[0][1] += direction === 'D' ? 1 : direction === 'U' ? -1 : 0;

        for (let j = 1; j < knots.length; j++) {
          knots[j] = moveKnot(knots[j - 1], knots[j]);
        }
        if (
          !visited.some(
            (pos) =>
              pos[0] === knots[knots.length - 1][0] &&
              pos[1] === knots[knots.length - 1][1]
          )
        )
          visited.push(knots[knots.length - 1]);
      }
    }
    return visited.length;
  },
};

export default challenge;
