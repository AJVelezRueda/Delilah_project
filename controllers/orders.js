const { QueryTypes } = require("sequelize");
const { db, getResourceById, deleteResoueceById, getAllResources } = require("../database");
const { cleanTables, allItmesByOrder, deleteOrderItems, insertNewItem, insertOrder, orderUpdate } = require("../models/orders-repository")

async function clean() {
    await cleanTables('orders', 'items');
}


async function findOrderById(id) {
    const order = await getResourceById('orders', id);
    order.items = await allItmesByOrder(id);

    return order;
}

async function deleteOrdersById(id) {
    await deleteOrderItems(id);
    await deleteResoueceById('orders', id);

}

async function listAll(req, res) {
    const orders = await getAllResources('orders');
    res.json({ orders }).status(200);
}

async function insertItems(order_id, items) {
    for (let item of items) {
        const newItem = {
            product_id: item.product_id,
            cantidad: item.cantidad,
            order_id
        };

        await insertNewItem(newItem);
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
        const order_id = await insertOrder(order);

        insertItems(order_id, items);

        res.status(201).json({ id: order_id });

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

        await orderUpdate(order);

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