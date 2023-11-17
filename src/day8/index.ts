import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge<number[][]> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) =>
    input.split('\n').map((line) => [...line].map(Number)),
  silver: (input) => {
    let treesVisible = 0;
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        if (
          input[i].slice(0, j).every((tree) => tree < input[i][j]) ||
          input[i].slice(j + 1).every((tree) => tree < input[i][j]) ||
          input
            .map((row) => row[j])
            .slice(0, i)
            .every((tree) => tree < input[i][j]) ||
          input
            .map((row) => row[j])
            .slice(i + 1)
            .every((tree) => tree < input[i][j])
        ) {
          treesVisible++;
        }
      }
    }
    return treesVisible;
  },
  gold: (input) => {
    const getScore = (tree: number, rowOrCol: number[]) => {
      const i = rowOrCol.findIndex((v) => v >= tree);
      return rowOrCol.length === 0 ? 0 : i === -1 ? rowOrCol.length : i + 1;
    };

    return Math.max(
      ...input
        .map((row, rowInd) =>
          row.map(
            (tree, colInd) =>
              getScore(tree, row.slice(0, colInd).reverse()) *
              getScore(tree, row.slice(colInd + 1)) *
              getScore(
                tree,
                input
                  .map((row) => row[colInd])
                  .slice(0, rowInd)
                  .reverse()
              ) *
              getScore(tree, input.map((row) => row[colInd]).slice(rowInd + 1))
          )
        )
        .flat()
    );
  },
};

export default challenge;
