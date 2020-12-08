const user = require('../controllers/user');
const pedidos = require('../controllers/pedidos');



function routes(app) {
    app.get('/users', user.listAll)
    app.get('/users/:id/', user.get)
    app.post('/users', user.create)
    app.put('/users/:id/', user.updateUser);
    app.delete('/users/:id/', user.remove);
    app.post('/users/:id/favoritos', user.createFavorite);
    app.delete('/users/:id/favoritos', user.removeFavorites);
    app.get('/pedidos', pedidos.getPedidos);
    app.post('/pedidos', pedidos.buy)
}

module.exports = routes;