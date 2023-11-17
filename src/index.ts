import 'dotenv/config';
import yargs from 'yargs';
import type { Challenge } from './challenges';
import fs from 'fs/promises';
import { join } from 'path';

const newChallengeFileTemplate = () => `import { join } from 'path';
import { Challenge } from '../challenges';

const challenge: Challenge</* TODO */> = {
  inputPath: join(__dirname, './input.txt'),
  processInput: (input) => {/* TODO */},
  // silver: (input) => {},
  // gold: (input) => {},
};

export default challenge;
`;

(async () => {
  const argv = await yargs.command('$0 <command> [day]', false, {
    day: {
      number: true,
    },
    command: {
      choices: ['run', 'new'],
    },
  }).argv;

  if (argv.command === 'run' && typeof argv.day === 'number') {
    let selectedChallenge: Challenge;

    console.log(
      ` SELECTED DAY: ${argv.day} `.padStart(25, '=').padEnd(33, '=') + '\n'
    );

    try {
      selectedChallenge = await import(`./day${argv.day}`).then(
        (challenge) => challenge.default
      );
    } catch {
      console.log("This challenge hasn't been solved yet");
      return;
    }
    const input = await fs.readFile(selectedChallenge.inputPath, 'utf-8');
    const processed = selectedChallenge.processInput(input.trimEnd());
    console.log(
      `Silver solution: ${
        selectedChallenge.silver
          ? selectedChallenge.silver(processed)
          : 'Not implemented yet'
      }`
    );
    console.log(
      `Gold solution:   ${
        selectedChallenge.gold
          ? selectedChallenge.gold(processed)
          : 'Not implemented yet'
      }\n`
    );
    console.log('='.repeat(33));
  } else if (argv.command === 'new') {
    const dayNumber =
      (argv.day as number) ??
      ((await fs.readdir(__dirname))
        .filter((fileOrDir) => /^day[1-9]\d?$/.test(fileOrDir))
        .map((dir) => Number(dir.slice(3)))
        .sort((a, b) => b - a)[0] || 0) + 1;
    const challengeDirPath = `./day${dayNumber}`;
    await fs.mkdir(join(__dirname, challengeDirPath));
    await fs.writeFile(
      join(__dirname, challengeDirPath, 'index.ts'),
      newChallengeFileTemplate(),
      'utf-8'
    );
    try {
      const input = await fetch(
        `https://adventofcode.com/2022/day/${dayNumber}/input`,
        {
          headers: {
            accept: 'text/html',
            cookie: process.env.SESSION_COOKIE || '',
          },
        }
      );
      if (!input.ok) throw new Error();
      const inputText = await (await input.blob()).text();
      await fs.writeFile(
        join(__dirname, challengeDirPath, 'input.txt'),
        inputText,
        'utf-8'
      );
    } catch {
      console.log(`Couldn't fetch input file, please download it manually`);
    }

    console.log('New challenge project created!');
  }
})();
