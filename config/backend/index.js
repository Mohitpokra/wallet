const defaultConfig = require('./common')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const env = process.env.NODE_ENV;


let envConfig = {
};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev');
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod');
    break;
  default:
    envConfig = require('./dev');
}

module.exports = Object.freeze({
  ...envConfig,
  ...defaultConfig
})