'use strict';

/**
 * Loads the necessary config depending on the environment
 * @module config
 */

let env = process.env.NODE_ENV || 'development';

module.exports = require(`./env/${process.env.NODE_ENV}.js`);
