import * as path from 'path';
import fs from 'fs-extra';

import { Command } from 'commander';

import * as git from '@builders/git';
import PackageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';


async function mainInterface(program: Command) {
  console.log('Initializing Git repository.');
  await git.initialize();

  const installingOnCurrentFolder = program.args[0] === '.';

  if (!installingOnCurrentFolder) {
    globals.targetFolder = program.args[0];
    await fs.mkdir(globals.workingDirectory);
  }

  const appName = !installingOnCurrentFolder
    ? program.args[0]
    : path.basename(__dirname);

  const dirName = path.resolve(globals.scriptBaseDirectory, appName);
  globals.dirname = dirName;

  await fs.mkdir(path.resolve(globals.workingDirectory, 'src'));

  console.log('\nInitalizing package.json');

  const packageJson = new PackageJson({ author: 'Set', name: appName });
  await packageJson.initializeCoreDependencies();

  console.log('\nCreating packages');

  await copyPackage('config', true);
  await fs.writeFile(path.resolve(globals.workingDirectory, '.env'), 'PORT=3030\n');

  await copyPackage('app', true);
  await packageJson.addDependency('express');
  await packageJson.addDependency('@types/express', true);
  await packageJson.addDependency('cors');
  await packageJson.addDependency('@types/cors', true);
  await packageJson.addDependency('helmet');
  
  await copyPackage('controllers');
  await copyPackage('errors');
  await copyPackage('middlewares');

  await copyPackage('models');
  await packageJson.addDependency('mongodb');

  await copyPackage('routers');

  await copyPackage('validation');
  await packageJson.addDependency('ajv');
  await packageJson.addDependency('ajv-errors');

  await packageJson.save();

  console.log('\nInstalling dependencies');
  // await packageJson.install();

  console.log('\nDoing initial commit');
  await git.add('.');
  await git.commit(`Initial commit by create-node-api @${await globals.version}`);
}

export default async function entry() {
  try {
    const program = new Command();

    program.version(await globals.version);
  
    program.argument('<folder>');

    program.action(() => mainInterface(program));
  
    program.parse();
  } catch (err) {
    handleError(err);
  }

};
