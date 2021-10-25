import { spawn } from 'child_process';

export const initialize = () => new Promise<void>((resolve, reject) => {
  const gitProcess = spawn('git', ['init'], { timeout: 15000 });

  gitProcess.on('error', (err) => {
    reject(err);
  });

  gitProcess.on('data', (data: any) => {
    console.log(data);
  })

  gitProcess.on('exit', (code) => {
    if (code !== 0) {
      const error = new Error(`Initializing git repo failed with code ${code}`,);
      reject(error);
    } else {
      resolve();
    }
  });
});
