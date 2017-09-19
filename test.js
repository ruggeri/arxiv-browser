var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/config/sequelize.json')[env];

console.log(config)
const knex = require('knex')(config);
knex.count("* as count").from("authors").then(res => console.log(res))
