import { spawnPromise } from '@utils/cpPromise';

export const initialize = () => new Promise<void>((resolve, reject) => {
  spawnPromise('git', ['init'], { timeout: 15000 })
    .then(resolve)
    .catch((code) => {
      const error = new Error(`Initializing git repo failed with code ${code}`,);
      reject(error);
    });
});

export const add = (folder: string) => spawnPromise('git', ['add', folder]);

export const commit = (message: string) => spawnPromise('git', ['commit', '-m', message]);
