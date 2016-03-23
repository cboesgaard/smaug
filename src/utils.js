'use strict';

import {hostname} from 'os';
import process from 'process';
import _ from 'lodash';
import {version} from '../package.json';


/**
 * @returns current log level
 */

function getCurrentLogLevel() {
  return process.env.LOG_LEVEL || 'INFO'; // eslint-disable-line no-process-env
}

/**
 * Convert a log level name to a corresponding numerical value
 *
 * @param logLevel log level to convert
 * @returns numerical log level
 */

function getNumericalLogLevel(logLevel) {
  var logLevels = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4
  };

  var numericalLogLevel = logLevels[logLevel.toUpperCase()];
  return numericalLogLevel;
}

/**
 * Log as JSON to stdout
 *
 * @param level log level
 * @param msg message to log
 * @param args map of additional key/values to log
 */
function doLog(level, msg, args) {
  var currentNumericalLogLevel = getNumericalLogLevel(getCurrentLogLevel());
  var targetNumericalLogLevel = getNumericalLogLevel(level);

  var blob = {
    '@timestamp': (new Date()).toISOString(),
    '@version': 1,
    app: 'serviceprovider',
    version: version,
    level: level.toUpperCase(),
    host: hostname(),
    pid: process.pid,
    msg: msg
  };

  if (currentNumericalLogLevel >= targetNumericalLogLevel) {
    console.log(JSON.stringify(_.merge(blob, args))); // eslint-disable-line no-console
  }
}

export const log = {
  log: doLog,
  info: (msg, args) => doLog('info', msg, args),
  warn: (msg, args) => doLog('warn', msg, args),
  error: (msg, args) => doLog('error', msg, args),
  debug: (msg, args) => doLog('debug', msg, args)
};