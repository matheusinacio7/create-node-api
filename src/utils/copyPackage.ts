import { promises as fs } from 'fs';
import * as path from 'path';
import globals from './globals';

export default async function copyPackage(packageName: string, onRoot = false) {
  const sourceDirectory = path.resolve(globals.scriptBaseDirectory, 'src', 'packages', packageName, '_default');
  onRoot || await fs.mkdir(path.resolve(globals.workingDirectory, 'src', packageName));
  const targetDirectory = path.resolve(globals.workingDirectory, onRoot ? '' : 'src', onRoot ? '' : packageName);
  
  const fileList = await fs.readdir(sourceDirectory);
  
  const copyPromises = fileList.map((fileName) => {
    console.log(fileName);
    const sourceFile = path.resolve(sourceDirectory, fileName);
    const targetFile = path.resolve(targetDirectory, fileName);

    return fs.copyFile(sourceFile, targetFile);
  });

  return Promise.all(copyPromises);
}

