'use strict';

/**
 * Loads the necessary config depending on the environment
 * @module config
 */

const env = process.env.NODE_ENV || 'development';

module.exports = require(`./env/${env}.js`);
