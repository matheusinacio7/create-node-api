import { promises as fs } from 'fs';
import * as path from 'path';
import type { Entry, PackageJson } from 'type-fest';

import ChildProcess from '@utils/ChildProcess';

import globals from '@utils/globals';

export default class Package {
  #object = {} as PackageJson;

  constructor({ author, name } : Pick<PackageJson, 'author' | 'name'>) {
    this.#object.name = name;
    this.#object.author = author;
    this.#object.main = 'index.ts';
    this.#object.version = '0.1.0';
    this.#object.license = 'MIT';
    this.#object.scripts = {
      start: 'ts-node -r dotenv/config -r esm -r tsconfig-paths/register index.ts',
      dev: 'ts-node-dev -r dotenv/config -r esm -r tsconfig-paths/register index.ts'
    };
    this.#object.dependencies = {};
    this.#object.devDependencies = {};  
  }

  add(...[key, value] : Entry<PackageJson>) {
    this.#object[key] = value as never;
  }

  async addDependency(depName: string, dev = false) {
    const cp = new ChildProcess('yarn', ['info', depName, 'version']);

    let version : string;

    cp.runningProcess.stdout.on('data', (chunk) => {
      const extractedVersion = chunk.toString().match(/\d+\.\d+\.\d+/);
      if (extractedVersion) {
        version = extractedVersion;
      }
    });

    await cp.execution;

    if (dev) {
      this.#object.devDependencies[depName] = '^' + version;
    } else {
      this.#object.dependencies[depName] = '^' + version;
    }  
  }

  async initializeCoreDependencies() {
    await this.addDependency('ts-node');
    await this.addDependency('dotenv');
    await this.addDependency('ts-node-dev', true);
    await this.addDependency('typescript', true);
    await this.addDependency('@types/node', true);
    await this.addDependency('esm');
    await this.addDependency('tsconfig-paths', true);
  }

  install() {
    return new ChildProcess('yarn').execution;
  }

  save() {
    const jsonFile = JSON.stringify(this.#object, null, '\t');

    return fs.writeFile(path.resolve(globals.workingDirectory, 'package.json'), jsonFile);
  }
}
