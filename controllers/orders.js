const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate orders", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate items", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}


async function findOrderById(id) {
    const orders = await db.query(`select * from orders where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    if (orders.length === 0) {
        throw new Error('The order does not exist');
    }

    return orders[0];
}

async function deleteOrdersById(id) {
    await db.query(`delete from orders where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}


async function listAll(req, res) {
    const orders = await db.query("select * from orders", { type: QueryTypes.SELECT });
    res.json({ orders }).status(200);
}

async function insertItems(order_id, items) {
    for (let item of items) {
        const newItem = {
            product_id: item.product_id,
            cantidad: item.cantidad,
            order_id
        };

        await db.query(`
        insert into items (product_id, cantidad, order_id) 
                    values (:product_id, :cantidad, :order_id)
    `, {
            replacements: newItem,
            type: QueryTypes.INSERT
        });
    }
}


async function create(req, res) {
    const order = {
        status: 'nuevo',
        user_id: req.body.user_id,
        description: req.body.description,
        address: req.body.address,
        payment_method: req.body.payment_method
    };
    const items = req.body.items;

    try {
        const result = await db.query(`
        insert into orders (status, user_id, description, address, payment_method) 
                    values (:status, :user_id, :description, :address, :payment_method)
    `, {
            replacements: order,
            type: QueryTypes.INSERT
        });

        const order_id = result[0];

        insertItems(order_id, items);

        res.json({ id: result[0] }).status(201);

    } catch (e) {
        res.json({ message: e.message }).status(500);
    }
}

function get(req, res) {
    res.json(findOrderById(req.body.status))
        .status(200);
}

async function update(req, res) {
    const order = findOrderById(req.body.id);

    order.id = req.body.id,
        order.status = req.body.status,
        order.user_id = req.body.user_id,
        order.description = req.body.description,
        order.address = req.body.address,
        order.payment_method = req.body.payment_method

    res.json(order).status(201);
}

async function remove(req, res) {
    await deleteOrdersById(Number(req.params.id));

    res.status(200).end();
}


async function clean() {

}

async function createItem(req, res) {

}


module.exports = {
    clean,
    listAll,
    get,
    create,
    update,
    remove
};