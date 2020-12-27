const { QueryTypes } = require("sequelize");
const db = require("../database");

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate users", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}

async function findUserById(id) {
    const users = await db.query(`select * from users where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });

    if (users.length === 0) {
        throw new Error('No existe el usuario');
    }

    return users[0];
}

async function deleteUserById(id) {
    await db.query(`delete from users where id = :id`, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    });
}

async function listAll(req, res) {
    const users = await db.query("select * from users", { type: QueryTypes.SELECT });
    res.json({ users }).status(200);
}

async function get(req, res) {
    res.json(await findUserById(Number(req.params.id)))
        .status(200);
}

async function create(req, res) {
    const user = {
        name: req.body.name,
        email: req.body.email,
    };

    const result = await db.query(`
        insert into users (name, email) values (:name, :email)
    `, {
        replacements: user,
        type: QueryTypes.INSERT
    });

    res.json({ id: result[0] }).status(201);
}

async function update(req, res) {
    const id = Number(req.params.id)

    await findUserById(id);

    const user = {
        id,
        name: req.body.name,
        email: req.body.email
    }

    await db.query(`
        update users set name = :name, email = :email where id = :id
    `, {
        replacements: user,
        type: QueryTypes.UPDATE
    });

    res.status(200).end();
}

async function remove(req, res) {
    await deleteUserById(Number(req.params.id));

    res.status(200).end();
}

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
    update,
    remove,
    createFavorite,
    removeFavorites
};