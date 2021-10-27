import ChildProcess from '@utils/ChildProcess';
import globals from '@utils/globals';

export const initialize = () => new Promise<void>((resolve, reject) => {
  new ChildProcess('git', ['init'], { timeout: 15000, cwd: globals.workingDirectory }).execution
    .then(resolve)
    .catch((code) => {
      const error = new Error(`Initializing git repo failed with code ${code}`,);
      reject(error);
    });
});

export const add = (folder: string) => new ChildProcess('git', ['add', folder], { cwd: globals.workingDirectory }).execution;

export const commit = (message: string) => new ChildProcess('git', ['commit', '-m', message], { cwd: globals.workingDirectory }).execution;
