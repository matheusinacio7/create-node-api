import * as path from 'path';
import fs from 'fs-extra';

import { Command } from 'commander';

import * as git from '@builders/git';
import PackageJson from '@builders/package';

import handleError from '@middlewares/handleError';

import globals from '@utils/globals';
import copyPackage from '@utils/copyPackage';
import ChildProcess from '@utils/ChildProcess';

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

  const createApp = Promise.all(
    [
      copyPackage('app', true),
      packageJson.changeScript('lint', 'eslint -c .eslintrc.json --ext .ts,.js .'),
      packageJson.addDependency('express'),
      packageJson.addDependency('@types/express', true),
      packageJson.addDependency('cors'),
      packageJson.addDependency('@types/cors', true),
      packageJson.addDependency('helmet'),
      packageJson.addDependency('@typescript-eslint/eslint-plugin', true),
      packageJson.addDependency('@typescript-eslint/parser', true),
      packageJson.addDependency('eslint', true),
      packageJson.addDependency('eslint-config-airbnb-base', true),
      packageJson.addDependency('eslint-import-resolver-typescript', true),
      packageJson.addDependency('eslint-plugin-import', true),
    ]
  );

  const createControllers = copyPackage('controllers');

  const createErrors = copyPackage('errors');

  const createMiddlewares = copyPackage('middlewares');
  
  const createModels = Promise.all([
    copyPackage('models'),
    packageJson.addDependency('mongodb'),
    packageJson.changeScript('dba_setup', 'node src/models/dba/setup.js'),
    packageJson.addDependency('bcrypt'),
    packageJson.addDependency('@types/bcrypt', true),
  ]);

  const createRouters = copyPackage('routers');

  const createServices = Promise.all([
    copyPackage('services'),
    packageJson.addDependency('ajv'),
    packageJson.addDependency('ajv-errors'),
    packageJson.addDependency('ajv-formats'),
    packageJson.addDependency('jsonwebtoken'),
    packageJson.addDependency('@types/jsonwebtoken', true),
    packageJson.changeScript('gen_ec_keys', 'openssl ecparam -genkey -name prime256v1 -noout -out ec_private.pem && openssl ec -in ec_private.pem -pubout -out ec_public.pem'),
    packageJson.changeScript('dev', 'yarn gen_ec_keys && ts-node-dev -r dotenv/config -r tsconfig-paths/register index.ts'),
    packageJson.changeScript('start', 'yarn gen_ec_keys && npm run build && TS_NODE_PROJECT=dist/tsconfig.json node -r tsconfig-paths/register ./dist/index.js'),
    packageJson.addDependency('ms'),
    packageJson.addDependency('@types/ms', true),
    packageJson.addDependency('nanoid'),
    packageJson.addDependency('redis@@4.0.0-rc.3'),
  ]);

  const createTests = Promise.all(
    [
      copyPackage('tests', true),
      packageJson.changeScript('test', 'yarn gen_ec_keys && jest'),
      packageJson.changeScript('test:coverage', 'yarn gen_ec_keys && jest --coverage --verbose=false'),
      packageJson.addDependency('jest', true),
      packageJson.addDependency('@types/jest', true),
      packageJson.addDependency('ts-jest', true),
      packageJson.addDependency('@sinonjs/fake-timers', true),
      packageJson.addDependency('@types/sinonjs__fake-timers', true),
      packageJson.addDependency('supertest', true),
      packageJson.addDependency('@types/supertest', true),
      packageJson.addDependency('mongodb-memory-server', true),
      packageJson.addDependency('@babel/core', true),
      packageJson.addDependency('@babel/preset-env', true),
      packageJson.addDependency('@babel/preset-typescript', true),
    ]
  );

  const createUtils = copyPackage('utils');

  await Promise.all([
    createApp,
    createTests,
    createControllers,
    createErrors,
    createMiddlewares,
    createModels,
    createRouters,
    createServices,
    createUtils
  ]);

  await packageJson.save();

  console.log('\nInstalling dependencies. This could take some time.');
  await packageJson.install();

  console.log('\nSetting up DB.');
  await new ChildProcess('yarn', ['dba_setup']).execution;

  console.log('\nDoing initial commit');
  await git.add('.');
  await git.commit(`Initial commit by create-node-api @${await globals.version}`);

  console.log('\nAll done! You can now start your project by running yarn dev!');
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
