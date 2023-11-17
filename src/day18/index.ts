import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<[number, number, number][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input
      .split('\n')
      .map((row) => row.split(',').map(Number) as [number, number, number]),
  silver: (input) => {
    const cubes: [number, number, number][] = [];
    let surfaceArea = 0;
    for (const [x1, y1, z1] of input) {
      surfaceArea +=
        6 -
        cubes.filter(
          ([x2, y2, z2]) =>
            (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2 <= 1
        ).length *
          2;
      cubes.push([x1, y1, z1]);
    }
    return surfaceArea;
  },
  gold: (input) => {
    const cubes: [number, number, number][] = [];
    const innerCubes: [number, number, number][] = [];
    let surfaceArea = 0;
    for (const [x1, y1, z1] of input) {
      const neighbors = cubes.filter(
        ([x2, y2, z2]) => (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2 <= 1
      ).length;
      const freeSides = 6 - neighbors * 2;
      surfaceArea += freeSides;
      cubes.push([x1, y1, z1]);
    }
    return surfaceArea;
  },
};

export default challenge;
