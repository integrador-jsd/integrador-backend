const Sequelize = require('sequelize');

const database = 'integrador';
const username = 'admin';
const password = 'admintesting';
const host = 'integrador-db.crj2su2zgzdr.us-east-2.rds.amazonaws.com';
const dialect = 'mysql';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
