const user = require('../controllers/user');
const products = require('../controllers/products');
const orders = require('../controllers/orders');
const session = require('../controllers/session');

const { filterAdmin } = require("./authentication.js");


function routes(app) {
    app.get('/users', filterAdmin, user.listAll)
    app.get('/users/:id', filterAdmin, user.get);
    app.post('/users', user.create);

    app.put('/users/:id', filterAdmin, user.update);
    app.delete('/users/:id', filterAdmin, user.remove);
    app.post('/users/:id/favoritos', user.createFavorite);
    app.delete('/users/:id/favoritos', user.removeFavorites);

    app.get('/products', products.listAll);
    app.get('/products/:id', products.get);
    app.put('/products/:id', filterAdmin, products.update);
    app.post('/products', filterAdmin, products.create);
    app.delete('/products/:id', filterAdmin, products.remove);

    app.get('/orders', filterAdmin, orders.listAll);
    app.get('/orders/:id', filterAdmin, orders.get);

    app.post('/orders', orders.create);
    app.delete('/orders/:id', orders.remove);
    app.put('/orders/:id', filterAdmin, orders.update);

    app.post('/login', session.login);
}

module.exports = routes;