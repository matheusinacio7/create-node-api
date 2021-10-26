import * as path from 'path';
import { promises as fs } from 'fs';

import { Command } from 'commander';

import * as git from '@builders/git';
import * as packageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';

import PackageJson from '@builders/package';

async function mainInterface(program: Command) {
  // console.log('Initializing Git repository.');

  const appName = program.args[0];

  const dirName = path.resolve(globals.scriptBaseDirectory, appName);
  globals.dirname = dirName;

  await fs.mkdir(path.resolve(globals.workingDirectory, 'src'));

  const packageJson = new PackageJson({ author: 'Set', name: appName });

  await copyPackage('app', true);
  await packageJson.addDependency('express');
  await packageJson.addDependency('cors');
  await packageJson.addDependency('helmet');
  
  await copyPackage('errors');
}

export default async function entry() {
  try {

    const program = new Command();

    program.version('0.0.22');
  
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
