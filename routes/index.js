const user = require('../controllers/user');



function routes(app) {
    app.get('/users', user.listAll)
    app.get('/users/:id/', user.get)
    app.post('/users', user.create)
    app.put('/users/:id/', user.update);
    app.delete('/users/:id/', user.remove);
    app.post('/users/:id/favoritos', user.createFavorite);
    app.delete('/users/:id/favoritos', user.removeFavorites);
}

module.exports = routes;