'use strict'

const getEnv = (name) => {
  if (!process.env[name]) {
      throw new Error('environment variable ' + name + ' is missing');
  }
  if (!process.env[name].match(/^(['"]).+\1$/)) {
      throw new Error('environment variable ' + name + ' needs to be quoted twice');
  }
  return process.env[name];
};

const envs = {
  NODE_ENV: '"production"'
};
[ "API_ROOT",
  "FACEBOOK_APP_ID",
  "GOOGLE_CLIENT_ID",
  "APP_NAME",
].forEach(env => {
  envs[env] = getEnv(env);
});

module.exports = envs;