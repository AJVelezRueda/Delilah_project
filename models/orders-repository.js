const { db } = require("../database");
const { QueryTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = 10;


async function cleanTables(table1, table2) {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query(`truncate ${table1}`, { type: QueryTypes.BULKDELETE });
    await db.query(`truncate ${table2}`, { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}


module.exports = {
    cleanTables
}