import { URL } from 'url';

let workingDirectory : string;

const globals = {
  get workingDirectory () {
    if (workingDirectory) return workingDirectory;
    workingDirectory = new URL('.', import.meta.url).pathname;

    return workingDirectory;
  },

  dirname: null as string,
};

export default globals;
