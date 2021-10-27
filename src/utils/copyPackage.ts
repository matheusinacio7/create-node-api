import fs from 'fs-extra';
import * as path from 'path';
import globals from './globals';

const recursiveCopy : any = (sourcePath: string, targetPath: string) => {
  // base case = target is a file
  if (!fs.lstatSync(sourcePath).isDirectory()) {
    // copy it
    return fs.copyFile(sourcePath, targetPath).then(() => {
      // if its .gitignore, rename it after copying, because npm renames it to npmignore
      // see https://github.com/npm/npm/issues/1862
      if (targetPath.includes('.npmignore')) {
        return fs.move(targetPath, targetPath.replace('npm', 'git'));
      }
    });
  }

  // recursive case = target is a folder
  // check if it exists
  return fs.pathExists(targetPath)
  // if not, create it
    .then((exists) => exists ? Promise.resolve() : fs.mkdir(targetPath))
  // then get file list
    .then(() => fs.readdir(sourcePath))
    .then((fileList) => {
      // if empty folder, ignore it after creating
      if (!fileList.length) return Promise.resolve();

      // map file list to recursive function
      const filePromises = fileList.map((fileName) => {
        const sourceFile = path.resolve(sourcePath, fileName);
        const targetFile = path.resolve(targetPath, fileName);

        return recursiveCopy(sourceFile, targetFile);
      });

      return Promise.all([filePromises]) as any;
    });
};

export default async function copyPackage(packageName: string, onRoot = false) {
  const sourceDirectory = path.resolve(globals.scriptBaseDirectory, 'src', 'packages', packageName, '_default');
  onRoot || await fs.mkdir(path.resolve(globals.workingDirectory, 'src', packageName));
  const targetDirectory = path.resolve(globals.workingDirectory, onRoot ? '' : 'src', onRoot ? '' : packageName);

  return recursiveCopy(sourceDirectory, targetDirectory);
}

