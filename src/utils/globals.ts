let scriptBaseDirectory : string;

const globals = {
  get scriptBaseDirectory () {
    if (scriptBaseDirectory) return scriptBaseDirectory;
    scriptBaseDirectory = __dirname;

    return scriptBaseDirectory;
  },

  get workingDirectory() {
    return process.cwd();
  },

  dirname: null as string,
};

export default globals;
