import { promises as fs } from 'fs';
import * as path from 'path';
import type { Entry, PackageJson } from 'type-fest';

import { spawnPromise } from '@utils/cpPromise';

export default class Package {
  #object = {} as PackageJson;

  constructor({ author, name } : Pick<PackageJson, 'author' | 'name'>) {
    this.#object.name = name;
    this.#object.author = author;
    this.#object.version = '0.1.0';
  }

  add([key, value] : Entry<PackageJson>) {
    this.#object[key] = value as never;
  }

  install() {
    return spawnPromise('yarn');
  }

  save(targetDirname: string) {
    const jsonFile = JSON.stringify(this.#object, null, '\t');

    return fs.writeFile(path.resolve(targetDirname, 'package.json'), jsonFile);
  }
}
