// db/init.js
const { Sequelize } = require('sequelize');

// Load environment variables from .env file
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres'
  }
);

module.exports = sequelize;
