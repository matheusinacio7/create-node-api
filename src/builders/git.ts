import * as cp from 'child_process';

export const initialize = () => new Promise<void>((resolve, reject) => {
  const gitProcess = cp.spawn('git', ['init'], { timeout: 15000 });

  gitProcess.on('error', (err) => {
    reject(err);
  });

  gitProcess.on('exit', (code) => {
    if (code !== 0) {
      const error = new Error('Initializing git repo failed with code');
      reject(error);
    } else {
      resolve();
    }
  });
});
