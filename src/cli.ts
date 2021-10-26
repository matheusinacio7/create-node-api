import * as path from 'path';
import { promises as fs } from 'fs';

import { Command } from 'commander';

import * as git from '@builders/git';
import * as packageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';

async function mainInterface(program: Command) {
  console.log('Initializing Git repository.');

  const dirName = path.resolve(globals.scriptBaseDirectory, program.args[0]);
  globals.dirname = dirName;

  await fs.mkdir(path.resolve(globals.workingDirectory, 'src'));

  await copyPackage('app', true);
  await copyPackage('errors');
}

export default async function entry() {
  try {

    const program = new Command();

    program.version('0.0.20');
  
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
