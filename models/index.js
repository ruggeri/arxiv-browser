var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/knexfile')[env];

const knex = require('knex')(config);

module.exports = {
  Author: require('./author.js')(knex),
  Authorship: require('./authorship.js')(knex),
  AuthorStatus: require('./author-status.js')(knex),
  Paper: require('./paper.js')(knex),
  PaperStatus: require('./paper-status.js')(knex),
};
