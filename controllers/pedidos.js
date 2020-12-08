pedidos = []


function getPedidos(req, res) {
    res.json({ pedidos }).status(200);
}

function buy(req, res) {
    const pedido = {
        usuario: req.body.usuario,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        pago: req.body.pago
    };

    pedidos.push(pedido);

    res.json(pedido).status(201);
}

module.exports = {
    getPedidos,
    buy
};