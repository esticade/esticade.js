'use strict';

const homedir = require('homedir');
const path = require('path');
const fs = require('fs');

module.exports = getConfig();

function getFromEnv(env, defaultValue) {
  return process.env[env] || defaultValue;
}


function getBooleanFromEnv(env, defaultValue) {
  let value = process.env[env];

  if (!value) {
    return defaultValue;
  }

  value = value.toLowerCase();
  return !!(value == 'yes' || value == 'on' || value == 'true')
}

function applyEnvironmentOverrides(config) {
  return {
    connectionURL: getFromEnv('ESTICADE_CONNECTION_URL', config.connectionURL),
    exchange: getFromEnv('ESTICADE_EXCHANGE', config.exchange),
    engraved: getBooleanFromEnv('ESTICADE_ENGRAVED', config.engraved),
    prefetch: parseInt(getFromEnv('ESTICADE_PREFETCH', config.prefetch)),
    logging: getBooleanFromEnv('ESTICADE_LOGGING_ENABLED', config.logging)
  }
}

function parseVariables(config) {
  if (config.connectionURL && config.connectionURL.includes(',')) {
    config.connectionURL = config.connectionURL.split(',')
  }
}

function getConfig() {
  let config = {
    connectionURL: 'amqp://guest:guest@localhost/',
    exchange: 'events',
    engraved: false,
    prefetch: 100,
    logging: false
  };

  const configFile = getConfigFile();

  if (configFile) {
    Object.assign(config, JSON.parse(fs.readFileSync(configFile)));
  }

  config = applyEnvironmentOverrides(config);

  parseVariables(config);

  return config;
}

function findCWDConfigFile() {
  let dir = process.cwd();
  do {
    var file = dir + path.sep + 'esticade.json';
    try {
      fs.accessSync(file, fs.R_OK)
      return file;
    } catch (e) {
    }
    var oldDir = dir;
    dir = path.resolve(dir, '..');
  } while (oldDir !== dir);
  return undefined;
}

function getConfigFile() {
  const configPaths = [
    process.env.ESTICADERC,
    findCWDConfigFile(),
    homedir() + path.sep + '.esticaderc',
    '/etc/esticade/esticaderc'
  ];

  return configPaths.filter(function (file) {
    try {
      fs.accessSync(file, fs.R_OK)
      return true;
    } catch (e) {
      return false;
    }
  })[0];
}
