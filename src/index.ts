import * as git from './builders/git';

function handleError(err: Error) {
  console.log(err.message);
  process.exit(-1);
}

async function entry() {
  console.log('Initializing Git repository.');

  await git.initialize()
    .then(() => {
      console.log('Git repository initialized successfully.');
    })
    .catch(handleError);
}

entry();
