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


async function allItmesByOrder(order_id) {
    const items = await db.query(`SELECT
    items.cantidad,
    products.name,
    products.id
    FROM items
    INNER JOIN products ON products.id = items.product_id
    WHERE items.order_id = :order_id
    `, {
        replacements: { order_id },
        type: QueryTypes.SELECT
    });

    if (items.length === 0) {
        throw new Error('The order does not exist');
    }

    return items;
}

async function deleteOrderItems(id) {
    await db.query(`delete from items where order_id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}


async function insertNewItem(newItem) {
    await db.query(`
    insert into items (product_id, cantidad, order_id)
                values (:product_id, :cantidad, :order_id)
`, {
        replacements: newItem,
        type: QueryTypes.INSERT
    });
}

async function insertOrder(order) {
    const result = await db.query(`
    insert into orders (status, user_id, description, address, payment_method)
                values (:status, :user_id, :description, :address, :payment_method)
`, {
        replacements: order,
        type: QueryTypes.INSERT
    });

    return result[0];
}

module.exports = {
    cleanTables,
    allItmesByOrder,
    deleteOrderItems,
    insertNewItem,
    insertOrder
}