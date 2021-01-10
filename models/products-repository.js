const { QueryTypes } = require("sequelize");
const { db } = require("../database");

async function insertProducts(products) {
    const result = await db.query(`
    insert into products (name, price) values (:name, :price)
`, {
        replacements: products,
        type: QueryTypes.INSERT
    });
    return result[0]
};


async function updateAProduct(product) {
    await db.query(`
        update products set name = :name, price = :price where id = :id
    `, {
        replacements: product,
        type: QueryTypes.UPDATE
    });
}

module.exports = {
    insertProducts,
    updateAProduct
}