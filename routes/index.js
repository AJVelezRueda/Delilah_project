const user = require('../controllers/user');
const pedidos = require('../controllers/orders');
const products = require('../controllers/products');
const products = require('../controllers/orders');



function routes(app) {
    app.get('/users', user.listAll)
    app.get('/users/:id/', user.get)
    app.post('/users', user.create)
    app.put('/users/:id/', user.update);
    app.delete('/users/:id/', user.remove);
    app.post('/users/:id/favoritos', user.createFavorite);
    app.delete('/users/:id/favoritos', user.removeFavorites);
    app.get('/products', products.listAll);
    app.get('/products/:id/', products.get);
    app.put('/products/:id/', products.update);
    app.post('/products', products.create);
    app.delete('/products/:id/', products.remove);
    app.get('/orders', orders.listAll);
    app.post('/orders', orders.create)
}

module.exports = routes;