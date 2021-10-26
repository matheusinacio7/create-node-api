import * as path from 'path';
import fs from 'fs-extra';

import { Command } from 'commander';
import ora from 'ora';

import * as git from '@builders/git';
import PackageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';


async function mainInterface(program: Command) {
  const spinner = ora('Initializing Git repository.').start();
  await git.initialize();

  const appName = !program.args[0].startsWith('.')
    ? program.args[0]
    : path.basename(__dirname);

  const dirName = path.resolve(globals.scriptBaseDirectory, appName);
  globals.dirname = dirName;

  await fs.mkdir(path.resolve(globals.workingDirectory, 'src'));

  spinner.text = '\nInitalizing package.json';

  const packageJson = new PackageJson({ author: 'Set', name: appName });
  await packageJson.initializeCoreDependencies();

  spinner.text = '\nCreating packages';

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

  spinner.text = '\nInstalling dependencies';
  await packageJson.install();

  spinner.text = '\nDoing initial commit';
  await git.add('.');
  await git.commit(`Initial commit by create-node-api @${await globals.version}`);

  spinner.stop();

  console.log(`\nAll done! You can check out the project at ${appName}, and run with yarn dev.`);
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
