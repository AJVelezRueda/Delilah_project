const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, 'delilah', 'D3L1L4HIS@W3S0m3!i5N\'T1t?', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

async function getResorceById(table, id) {
    const resorce = await db.query(`select * from ${table} where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    return resorce;
};

module.exports = {
    db,
    getResorceById
};