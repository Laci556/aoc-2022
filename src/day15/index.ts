import { join } from 'path';
import { Challenge } from '../challenges';

type Sensor = {
  pos: { x: number; y: number };
  beacon: { x: number; y: number };
  radius: number;
};

const getSegments = (input: Sensor[], row: number, limits?: [number, number]) =>
  input
    .filter((sensor) => Math.abs(sensor.pos.y - row) <= sensor.radius)
    .map(
      (sensor) =>
        [
          sensor.pos.x - (sensor.radius - Math.abs(sensor.pos.y - row)),
          sensor.pos.x + (sensor.radius - Math.abs(sensor.pos.y - row)),
        ] as [number, number]
    )
    .sort(([startA], [startB]) => startA - startB)
    .reduce<[number, number][]>((prev, current) => {
      const [currentStart, currentEnd] = limits
        ? current.map((c) => Math.min(Math.max(c, limits[0]), limits[1]))
        : current;
      if (prev.length === 0) return [[currentStart, currentEnd]];
      const [segmentStart, segmentEnd] = prev[prev.length - 1];
      if (currentEnd <= segmentEnd) return prev;
      if (currentStart > segmentEnd + 1)
        return [...prev, [currentStart, currentEnd]];
      return [...prev.slice(0, prev.length - 1), [segmentStart, currentEnd]];
    }, []);

const challenge: Challenge<Sensor[]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => {
    const beacons: Record<string, Sensor['beacon']> = {};
    return input.split('\n').map((row) => {
      const coords = row
        .replace(/[^0-9\-]+/g, ' ')
        .slice(1)
        .split(' ')
        .map(Number);
      if (!beacons[`${coords[2]};${coords[3]}`])
        beacons[`${coords[2]};${coords[3]}`] = { x: coords[2], y: coords[3] };
      return {
        pos: { x: coords[0], y: coords[1] },
        beacon: beacons[`${coords[2]};${coords[3]}`],
        radius:
          Math.abs(coords[0] - coords[2]) + Math.abs(coords[1] - coords[3]),
      };
    });
  },
  silver: (input) =>
    getSegments(input, 2_000_000).reduce(
      (sum, [start, end]) =>
        sum +
        (end - start + 1) -
        [...new Set(input.map(({ beacon }) => beacon))].filter(
          ({ x, y }) => y === 2_000_000 && x >= start && x <= end
        ).length,
      0
    ),
  gold: (input) => {
    console.time();
    const limit = 4_000_000;
    for (let row = 0; row <= limit; row++) {
      const segments = getSegments(input, row, [0, limit]);
      if (segments.length > 1) {
        console.timeEnd();
        return (segments[0][1] + 1) * limit + row;
      }
    }
    return 0;
  },
};

export default challenge;
