import cp from 'child_process';
import globals from './globals';

export default class ChildProcess {
  runningProcess : cp.ChildProcess;
  execution : Promise<void>;

  constructor(...[command, params, options = {}] : Partial<Parameters<typeof cp.spawn>>) {
    const DEFAULT_OPTIONS = {
      cwd: globals.workingDirectory,
    };

    this.runningProcess = cp.spawn(command, params, Object.assign(DEFAULT_OPTIONS, options));

    Object.defineProperty(this, 'execution', { get: function() {
      return new Promise<void>((resolve, reject) => {
        this.runningProcess.on('exit', (code: number) => {
          if (code !== 0) return reject(code);

          resolve();
        })
      });
    }});
  }
}

