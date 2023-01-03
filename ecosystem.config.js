const path = require('path');

module.exports = {
  apps: [
    {
      name: 'da2jobu-prod',
      script: path.resolve(__dirname, './dist/main.js'),
      wait_ready: true,
      instances: 0,
      exec_mode: 'cluster',
      listen_timeout: 50000,
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
