const webpack = require('webpack');
const path = require('path');
const dotenvConfig = require('dotenv').config(); // assign env variables from .env to process.env

const pkg = require('./package.json');

if (dotenvConfig.error) throw dotenvConfig.error;

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      ΈNV: {
        APP_VERSION: JSON.stringify(pkg.version),
        NICE_FEATURE: JSON.stringify(true), // in this way we can remove a lot of code from the final bundle
        // BUILT_AT: webpack.DefinePlugin.runtimeValue(Date.now, [path.resolve(__dirname, 'sample.txt')]),
        ...getProcessEnv(),
      },
    }),
  ],
};

function getProcessEnv() {
  const options = [
    { key: 'SERVICE_URL', validate: (val) => isURL(val) },
    { key: 'EXPERIMENTAL_FEATURE', validate: (val) => isBool(val) },
    { key: 'USE_MOCK', validate: (val) => isBool(val) },
  ];

  const result = {};

  for (let option of options) {
    if (typeof option.validate === 'function' && !option.validate(process.env[option.key])) {
      throw new Error(`
        Required Process Env is not valid,
        key: ${option.key},
        val: ${process.env[option.key]},
        `);
    }

    result[option.key] = JSON.stringify(process.env[option.key]);
  }

  return result;
}

// validators. Consider using `validator` lib (face an issue with validator.isURL(), so for now better stick with own implementation)
function isBool(val) {
  return val && (val === 'true' || val === 'false');
}
function isURL(val) {
  return val && (val.startsWith('http://') || val.startsWith('https://'));
}
