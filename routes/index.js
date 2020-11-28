const user = require('../controllers/user');

function routes(app) {
    app.route('/users/:id?/')
        .get(user.get)
        .post(user.create)
        .put(user.update)
        .delete(user.delete)
}

module.exports = routes;