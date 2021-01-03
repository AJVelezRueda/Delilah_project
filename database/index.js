const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, 'delilah', 'D3L1L4HIS@W3S0m3!i5N\'T1t?', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

module.exports = db;
