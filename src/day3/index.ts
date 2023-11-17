import { join } from 'path';
import { Challenge } from '../challenges';

const getPriority = (item: string) =>
  item.charCodeAt(0) - (item.charCodeAt(0) > 96 ? 96 : 38);

const challenge: Challenge<[string[], string[]][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input
      .split('\n')
      .map((line) => [
        [...line.slice(0, line.length / 2)],
        [...line.slice(line.length / 2)],
      ]),
  silver: (input) =>
    input.reduce((prev, [a, b]) => {
      const item = a.find((el) => b.includes(el))!;
      const priority = getPriority(item);
      return prev + priority;
    }, 0),
  gold: (input) =>
    input
      .reduce<string[][][]>((prev, [a, b], i) => {
        if (!(i % 3)) prev.push([]);
        prev[prev.length - 1].push([...a, ...b]);
        return prev;
      }, [])
      .map(
        ([a, b, c]) =>
          a.find((el) => b.filter((el) => c.includes(el)).includes(el))!
      )
      .reduce((prev, item) => prev + getPriority(item), 0),
};

export default challenge;
