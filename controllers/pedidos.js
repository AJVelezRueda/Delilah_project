pedidos = []

let contador = 0

function idPedidos() {
    contador = contador + 1
    return contador
}

function findPedidoById(id) {
    pedidos = pedidos.filter(it => it.id === id)
}

function getPedidos(req, res) {
    res.json({ pedidos }).status(200);
}

function buy(req, res) {
    const pedido = {
        id: idPedidos(),
        status: 'nuevo',
        usuario: req.body.usuario,
        descripcion: req.body.descripcion,
        direccion: req.body.direccion,
        pago: req.body.pago
    };

    pedidos.push(pedido);

    res.json(pedido).status(201);
}

function getPedidoStatus(req, res) {
    res.json(findPedidoById(req.body.status))
        .status(200);
}

function updatePedidoStatus(req, res) {
    const pedido = findPedidoById(req.body.id);

    pedido.id = req.body.id,
        pedido.status = req.body.status,
        pedido.usuario = req.body.usuario,
        pedido.descripcion = req.body.descripcion,
        pedido.direccion = req.body.direccion,
        pedido.pago = req.body.pago

    res.json(pedido).status(201);
}


module.exports = {
    getPedidos,
    buy,
    getPedidoStatus,
    updatePedidoStatus
};