import ChildProcess from '@utils/ChildProcess';

export const initialize = () => new Promise<void>((resolve, reject) => {
  new ChildProcess('git', ['init'], { timeout: 15000 }).execution
    .then(resolve)
    .catch((code) => {
      const error = new Error(`Initializing git repo failed with code ${code}`,);
      reject(error);
    });
});

export const add = (folder: string) => new ChildProcess('git', ['add', folder]).execution;

export const commit = (message: string) => new ChildProcess('git', ['commit', '-m', message]).execution;
