const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize('test', 'root', 'CULO1234', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

async function clean() {
    await db.query("truncate Pedidos", { type: QueryTypes.BULKDELETE });
}


function findPedidoById(id) {
    const pedidos = await db.query(`select * from pedidos where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    if (pedidos.length === 0) {
        throw new Error('No existe el usuario');
    }
    
    return pedidos[0];
}

async function deletePedidosById(id) {
    await db.query(`delete from Pedidos where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}


function listAll(req, res) {
    res.json({ pedidos }).status(200);
}

function create(req, res) {
    const pedido = {
        status: 'nuevo',
        usuario: req.body.usuario,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        pago: req.body.pago
    };

    const result = await db.query(`
        insert into products (status, price, descripcion, direccion, pago) values (:status, :price, :descripcion, direccion:, pago:)
    ` , {
        replacements: products,
        type: QueryTypes.INSERT
    });

    res.json({ id: result[0] }).status(201);
}

function get(req, res) {
    res.json(findPedidoById(req.body.status))
        .status(200);
}

function update(req, res) {
    const pedido = findPedidoById(req.body.id);

    pedido.id = req.body.id,
        pedido.status = req.body.status,
        pedido.usuario = req.body.usuario,
        pedido.descripcion = req.body.descripcion,
        pedido.direccion = req.body.direccion,
        pedido.pago = req.body.pago

    res.json(pedido).status(201);
}

async function remove(req, res) {
    await deletePedidosById(Number(req.params.id));

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