import { promises as fs } from 'fs';
import type { PackageJson } from 'type-fest';
import path from 'path';

let scriptBaseDirectory : string;
let currentVersion : string;
let targetFolder : string;

const globals = {
  get scriptBaseDirectory () {
    if (scriptBaseDirectory) return scriptBaseDirectory;
    scriptBaseDirectory = __dirname;

    return scriptBaseDirectory;
  },

  get workingDirectory() {
    return targetFolder ? path.resolve(process.cwd(), targetFolder) : process.cwd();
  },

  set targetFolder(target : string) {
    targetFolder = target;
  },

  get version() {
    return currentVersion || fs.readFile(path.resolve(__dirname, 'package.json'))
      .then((fileBuffer) => JSON.parse(fileBuffer.toString()))
      .then((packageJson: PackageJson) => {
        currentVersion = packageJson.version;
        return currentVersion;
      });
  },

  dirname: null as string,
};

export default globals;
