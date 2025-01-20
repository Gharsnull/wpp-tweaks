const glob = require('glob');

module.exports = {
  apps: [
    ...glob.sync('./packages/*/ecosystem.config.js', { dotRelative: true }).map(p => require(p))
  ]
}