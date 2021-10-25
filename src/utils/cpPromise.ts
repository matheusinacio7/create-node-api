import * as cp from 'child_process';

export const spawnPromise = ( ...params:
    Partial<Parameters<typeof cp.spawn>>
  ) => new Promise<void>((resolve, reject) => {
  const childProcess = cp.spawn(...params);

  childProcess.on('exit', (code) => {
    if (code !== 0) {
      return reject(code);
    }

    resolve();
  });
});
