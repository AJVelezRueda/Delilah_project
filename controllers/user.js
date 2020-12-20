const { Sequelize, QueryTypes } = require("sequelize");

const db = new Sequelize('test', 'root', 'CULO1234', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
})

async function clean() {
    await db.query("truncate users" ,{type: QueryTypes.BULKDELETE});
}

function findUserById(id) {
    return users.find(it => it.id === id);
}

function deleteUserById(id) {
    users = users.filter(it => it.id !== id)
}

async function listAll(req, res) {
    const users = await db.query("select * from users", { type: QueryTypes.SELECT });
    res.json({ users }).status(200);
}

function get(req, res) {
    res.json(findUserById(Number(req.params.id)))
        .status(200);
}

async function create(req, res) {
    const user = {
        name: req.body.name,
        email: req.body.email,
    };

    const result = await db.query(`
        insert into users (name, email) values (:name, :email)
    ` ,{ 
        replacements: user,
        type: QueryTypes.INSERT 
    });
    res.json(result).status(201);
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
    clean,
    listAll,
    get,
    create,
    updateUser,
    remove,
    createFavorite,
    removeFavorites
};