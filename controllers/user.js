const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize('test', 'root', 'CULO1234', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

function findUserById(id) {
    return users.find(it => it.id === id);
}

function deleteUserById(id) {
    users = users.filter(it => it.id !== id)
}

function listAll(req, res) {
    db.query("select * from users", { type: QueryTypes.SELECT })
        .then(users => res.json({ users }).status(200));

}

function get(req, res) {
    res.json(findUserById(Number(req.params.id)))
        .status(200);
}

function create(req, res) {
    const user = {
        id: userId++,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    users.push(user);

    res.json(user).status(201);
}

function updateUser(req, res) {
    const user = findUserById(Number(req.params.id));

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    res.json(user).status(200);
}

function remove(req, res) {
    deleteUserById(Number(req.params.id));

    res.status(200);
}

//¿Cómo es que se generan los id para les usuaries y como es que sabe el front?
//¿Debería pasarle en el userCreate un id o cuando se loguea?
function createFavorite(req, res) {
    const favorite = {
        favorite: req.body.favorite,
        userId: req.body.userId
    };

    favorites.push(favorite);

    res.json(favorite).status(201);
}

function deleteUserFavorite(id) {
    favorites = favorites.filter(it => it.userId === id)
}


function removeFavorites(req, res) {
    deleteUserFavorite(req.body.id);

    res.json(favorite).status(201);
}

module.exports = {
    listAll,
    get,
    create,
    updateUser,
    remove,
    createFavorite,
    removeFavorites
};