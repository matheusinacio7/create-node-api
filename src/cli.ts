import * as path from 'path';
import { promises as fs } from 'fs';

import { Command } from 'commander';

import * as git from '@builders/git';
import * as packageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';

async function mainInterface(program: Command) {
  console.log('Initializing Git repository.');

  const dirName = path.resolve(globals.scriptBaseDirectory, program.args[0]);
  globals.dirname = dirName;

  const sourceDirectory = path.resolve(globals.scriptBaseDirectory, 'src', 'packages', 'errors', '_default');
  await fs.mkdir(path.resolve(globals.workingDirectory, 'src'));
  await fs.mkdir(path.resolve(globals.workingDirectory, 'src', 'errors'));
  const targetDirectory = path.resolve(globals.workingDirectory, 'src', 'errors');
  
  const fileList = await fs.readdir(sourceDirectory);
  
  const copyPromises = fileList.map((fileName) => {
    const sourceFile = path.resolve(sourceDirectory, fileName);
    const targetFile = path.resolve(targetDirectory, fileName);

    return fs.copyFile(sourceFile, targetFile);
  });

  await Promise.all(copyPromises);
}

export default async function entry() {
  try {

    const program = new Command();

    program.version('0.0.16');
  
    program.argument('<folder>');

    program.action(() => mainInterface(program));
  
    program.parse();
  } catch (err) {
    handleError(err);
  }

  // await git.initialize()
  //   .then(() => {
  //     console.log('Git repository initialized successfully.');
  //   })
  //   .catch(handleError);
};
