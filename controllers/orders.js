const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate orders", { type: QueryTypes.BULKDELETE });
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

    const order = orders[0];
    order.items = await allItmesByOrder(id);

    return order;
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

async function deleteOrdersById(id) {
    await db.query(`delete from items where order_id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });

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
        status: 'new',
        user_id: req.user_id,
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

        res.status(201).json({ id: result[0] });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function get(req, res) {
    res.json(await findOrderById(Number(req.params.id)))
        .status(200);
}

async function update(req, res) {
    try {
        const order = await findOrderById(Number(req.params.id));

        order.status = req.body.status;
        order.description = req.body.description;
        order.address = req.body.address;
        order.payment_method = req.body.payment_method

        await db.query(`
            update orders set status = :status, 
            description = :description, 
            address = :address, 
            payment_method = :payment_method 
            where id = :id
        `, {
            replacements: order,
            type: QueryTypes.UPDATE
        });

        res.status(200).end();
    } catch (e) {
        if (e.message == 'No existe la orden') {
            res.status(404).end();
        } else {
            res.status(500).json({ message: e.message });
        }
    }
}

async function remove(req, res) {
    await deleteOrdersById(Number(req.params.id))
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