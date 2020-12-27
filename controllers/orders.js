const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate orders", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}


function findOrderById(id) {
    const orders = await db.query(`select * from Orders where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    if (orders.length === 0) {
        throw new Error('No existe el usuario');
    }

    return Orders[0];
}

async function deleteOrdersById(id) {
    await db.query(`delete from Orders where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}


function listAll(req, res) {
    res.json({ Orders }).status(200);
}

function create(req, res) {
    const order = {
        status: 'nuevo',
        user_id: req.body.userId,
        product_id: req.body.productId,
        description: req.body.description,
        direccion: req.body.direccion,
        pago: req.body.pago
    };

    try {
        const result = await db.query(`
        insert into orders (status, price, description, direccion, pago) values (:status, :price, :description, direccion:, pago:)
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

function update(req, res) {
    const pedido = findOrderById(req.body.id);

    pedido.id = req.body.id,
        pedido.status = req.body.status,
        pedido.usuario = req.body.usuario,
        pedido.description = req.body.description,
        pedido.direccion = req.body.direccion,
        pedido.pago = req.body.pago

    res.json(pedido).status(201);
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