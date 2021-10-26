import { promises as fs } from 'fs';
import * as path from 'path';
import type { Entry, PackageJson } from 'type-fest';

import { spawnPromise } from '@utils/cpPromise';
import { spawn } from 'child_process';

import globals from '@utils/globals';

export default class Package {
  #object = {} as PackageJson;

  constructor({ author, name } : Pick<PackageJson, 'author' | 'name'>) {
    this.#object.name = name;
    this.#object.author = author;
    this.#object.main = 'index.ts';
    this.#object.version = '0.1.0';
    this.#object.license = 'MIT';
    this.#object.type = 'module';
    this.#object.scripts = {
      start: 'ts-node -r dotenv/config index.ts',
      dev: 'ts-node-dev -r dotenv/config index.ts'
    };
    this.#object.dependencies = {};
    this.#object.devDependencies = {};  
  }

  add(...[key, value] : Entry<PackageJson>) {
    this.#object[key] = value as never;
  }

  async addDependency(depName: string, dev = false) {
    return new Promise<string>((resolve, reject) => {
      const cp = spawn('yarn', ['info', depName, 'version']);

      let version : string;
  
      cp.stdout.on('data', (chunk) => {
        const extractedVersion = chunk.toString().match(/\d+\.\d+\.\d+/);
        if (extractedVersion) {
          version = extractedVersion;
        }
      });

      cp.on('close', () => resolve(version));

      cp.on('error', reject);
    })
    .then((version) => {
      if (dev) {
        this.#object.devDependencies[depName] = '^' + version;
      } else {
        this.#object.dependencies[depName] = '^' + version;
      }
    });
  }

  async initializeCoreDependencies() {
    await this.addDependency('ts-node');
    await this.addDependency('dotenv');
    await this.addDependency('ts-node-dev', true);
    await this.addDependency('typescript', true);
    await this.addDependency('@types/node', true);
  }

  install() {
    return spawnPromise('yarn');
  }

  save() {
    const jsonFile = JSON.stringify(this.#object, null, '\t');

    return fs.writeFile(path.resolve(globals.workingDirectory, 'package.json'), jsonFile);
  }
}
