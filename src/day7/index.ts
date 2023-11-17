import { join } from 'path';
import { Challenge } from '../challenges';

type FileSystem = {
  [key: string]: FileSystem | number;
};

const getDirectory = (fileSystem: FileSystem, path: string[]) => {
  let directory = fileSystem;
  path.forEach((d) => (directory = directory[d] as FileSystem));
  return directory;
};

const getSize = (directory: FileSystem): number => {
  if (
    Object.values(directory).every((dirOrFile) => typeof dirOrFile === 'number')
  ) {
    return Object.values(directory as Record<string, number>).reduce(
      (a, b) => a + b,
      0
    );
  }
  return Object.values(directory).reduce<number>(
    (prev, curr) =>
      prev + (typeof curr === 'number' ? curr : getSize(curr as FileSystem)),
    0
  );
};

const getSumOfSizes = (directory: FileSystem, result: { sum: number }) => {
  const s = getSize(directory);
  if (s <= 100000) {
    result.sum += s;
  }
  if (Object.values(directory).every((d) => typeof d === 'number')) return;
  for (const val of Object.values(directory)) {
    if (typeof val === 'object') getSumOfSizes(val, result);
  }
};

const getMinSize = (
  directory: FileSystem,
  toFree: number,
  result: { min: number }
) => {
  const s = getSize(directory);
  if (s > toFree && s < result.min) result.min = s;
  if (Object.values(directory).every((d) => typeof d === 'number')) return;
  for (const val of Object.values(directory)) {
    if (typeof val === 'object') getMinSize(val, toFree, result);
  }
};

const challenge: Challenge<FileSystem> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (_input) => {
    const input = _input.split('\n');
    const fileSystem: FileSystem = { '/': {} };
    const currentPath: string[] = [];
    for (const line of input) {
      if (line.startsWith('$ cd')) {
        const directory = line.split(' ')[2];
        if (directory === '..') {
          currentPath.pop();
        } else {
          currentPath.push(directory);
        }
      } else if (line !== '$ ls') {
        const [size, name] = line.split(' ');
        getDirectory(fileSystem, currentPath)[name] =
          size === 'dir' ? {} : Number(size);
      }
    }
    return fileSystem;
  },
  silver: (input) => {
    const result = { sum: 0 };
    getSumOfSizes(input['/'] as FileSystem, result);
    return result.sum;
  },
  gold: (input) => {
    const totalSize = getSize(input['/'] as FileSystem);
    const toFree = 30_000_000 - (70_000_000 - totalSize);
    const result = { min: Infinity };
    getMinSize(input['/'] as FileSystem, toFree, result);
    return result.min;
  },
};

export default challenge;
