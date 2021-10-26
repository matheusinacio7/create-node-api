import cp from 'child_process';

export default class ChildProcess {
  runningProcess : cp.ChildProcess;
  execution : Promise<void>;

  constructor(...args : Partial<Parameters<typeof cp.spawn>>) {
    this.runningProcess = cp.spawn(...args);

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

