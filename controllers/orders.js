const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate orders", { type: QueryTypes.BULKDELETE });
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

async function create(req, res) {
    const order = {
        status: 'nuevo',
        user_id: req.body.user_id,
        item_id: req.body.item_id,
        description: req.body.description,
        address: req.body.address,
        payment_method: req.body.payment_method
    };

    try {
        const result = await db.query(`
        insert into orders (status, user_id, item_id, description, address, payment_method) 
                    values (:status, :user_id, :item_id, :description, :address, :payment_method)
    `, {
            replacements: order,
            type: QueryTypes.INSERT
        });

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
        order.item_id = req.body.item_id,
        order.description = req.body.description,
        order.address = req.body.address,
        order.payment_method = req.body.payment_method

    res.json(order).status(201);
}

async function remove(req, res) {
    await deleteOrdersById(Number(req.params.id));

    res.status(200).end();
}

module.exports = {
    clean,
    listAll,
    get,
    create,
    update,
    remove
};