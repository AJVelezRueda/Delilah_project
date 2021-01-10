const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, 'delilah', 'D3L1L4HIS@W3S0m3!i5N\'T1t?', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

async function getResourceById(table, id) {
    const resource = await db.query(`select * from ${table} where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    if (resource.length === 0) {
        throw new Error(`No existe el recurso en ${table}`);
    }

    return resource[0];
};

async function getAllResources(table) {
    return await db.query(`select * from ${table}`, { type: QueryTypes.SELECT });
}


async function deleteResoueceById(table, id) {
    await db.query(`delete from ${table} where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}

module.exports = {
    db,
    getResourceById,
    getAllResources,
    deleteResoueceById
};