import { join } from 'path';
import { Challenge } from '../challenges';

type Packet = number | Packet[];

const compare = (a: Packet, b: Packet): -1 | 0 | 1 => {
  if (typeof a === 'number' && typeof b === 'number')
    return a > b ? -1 : a === b ? 0 : 1;
  if (Array.isArray(a) && Array.isArray(b)) {
    const res = a.reduce<-1 | 0 | 1>(
      (prev, current, currentIndex) =>
        prev !== 0
          ? prev
          : b[currentIndex] === undefined
          ? -1
          : compare(current, b[currentIndex]),
      0
    );
    return res || (a.length < b.length ? 1 : 0);
  }
  if (Array.isArray(a)) {
    return compare(a, [b]);
  }
  return compare([a], b);
};

const challenge: Challenge<[Packet, Packet][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input
      .split('\n\n')
      .map(
        (pair) =>
          pair.split('\n').map((packet) => eval(packet) as Packet) as [
            Packet,
            Packet
          ]
      ),
  silver: (input) =>
    input.reduce(
      (sum, [a, b], index) => sum + (compare(a, b) === 1 ? index + 1 : 0),
      0
    ),
  gold: (input) => {
    const d1 = [[2]],
      d2 = [[6]];
    const sorted = [...input.flat(), d1, d2].sort((a, b) => -compare(a, b));
    return (sorted.indexOf(d1) + 1) * (sorted.indexOf(d2) + 1);
  },
};

export default challenge;
