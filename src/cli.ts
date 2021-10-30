import * as path from 'path';
import fs from 'fs-extra';

import { Command } from 'commander';

import * as git from '@builders/git';
import PackageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';

async function mainInterface(program: Command) {
  const installingOnCurrentFolder = program.args[0] === '.';
  
  if (!installingOnCurrentFolder) {
    globals.targetFolder = program.args[0];
    await fs.mkdir(globals.workingDirectory);
  }
  
  console.log('Initializing Git repository.');
  await git.initialize();

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
  let envFile = '';
  envFile += 'PORT=3030\n';
  envFile += 'NODE_ENV=development\n';
  envFile += 'CONNECTION_STRING=mongodb://localhost:27017\n';
  envFile += 'DB_NAME=cnaTestDb';
  await fs.writeFile(path.resolve(globals.workingDirectory, '.env'), envFile);

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
  await packageJson.changeScript('dba_setup', 'node src/models/dba/setup.js');
  await packageJson.addDependency('bcrypt');
  await packageJson.addDependency('@types/bcrypt', true);

  await copyPackage('routers');

  await copyPackage('services');
  await packageJson.addDependency('ajv');
  await packageJson.addDependency('ajv-errors');
  await packageJson.addDependency('ajv-formats');
  await packageJson.addDependency('jsonwebtoken');
  await packageJson.addDependency('@types/jsonwebtoken', true);
  await packageJson.changeScript('gen_ec_keys', 'openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem && openssl ec -in ec_private.pem -pubout -out ec_public.pem');
  await packageJson.changeScript('dev', 'yarn gen_ec_keys && ts-node-dev -r dotenv/config -r tsconfig-paths/register index.ts');
  await packageJson.changeScript('start', 'yarn gen_ec_keys && npm run build && TS_NODE_PROJECT=dist/tsconfig.json node -r tsconfig-paths/register ./dist/index.js');
  await packageJson.addDependency('ms');
  await packageJson.addDependency('@types/ms', true);
  await packageJson.addDependency('nanoid');
  await packageJson.addDependency('redis@next');

  await copyPackage('utils');

  await packageJson.save();

  console.log('\nInstalling dependencies');
  await packageJson.install();

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
