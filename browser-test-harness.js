const childProcess = require('child_process');
const path = require('path');
const waitOn = require('wait-on');
const ports = require('./server-ports');

const storybook = childProcess.spawn(process.execPath, [
  path.join('node_modules', '.bin', 'cross-env-shell'),
  'DISABLE_HMR=true',
  'USE_PRODUCTION_BUILD=true',
  path.join('node_modules', '.bin', 'start-storybook'),
  '--ci',
  '-p',
  `${ports.storybook}`,
]);

const cspServer = childProcess.spawn(process.execPath, [
  path.join('node_modules', '.bin', 'cross-env-shell'),
  'USE_PRODUCTION_BUILD=true',
  path.join('csp-server', 'start.sh'),
  `${ports.cspServer}`,
]);

process.on('exit', () => {
  storybook.kill();
  cspServer.kill();
});

Promise.all([
  waitOn({
    resources: [`http://localhost:${ports.storybook}/`],
    timeout: 60000,
  }),
  waitOn({
    resources: [`http://localhost:${ports.cspServer}/`],
    timeout: 60000,
  }),
])
  .then(() => {
    if (!process.argv[2]) {
      // eslint-disable-next-line no-restricted-syntax
      throw new Error('Started servers but no command supplied to run after');
    }

    const child = childProcess.spawn(process.argv[2], process.argv.slice(3), {
      stdio: 'inherit',
    });

    process.on('exit', () => {
      child.kill();
    });

    child.on('exit', (code) => {
      // eslint-disable-next-line no-process-exit
      process.exit(code);
    });
  })
  .catch((error) => {
    storybook.kill();
    cspServer.kill();

    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line no-restricted-syntax
    throw new Error('Unable to spin up standalone servers');
  });
