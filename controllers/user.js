const { QueryTypes } = require("sequelize");
const { db, getResorceById } = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const salt = 10;

async function clean() {
    await db.query("SET FOREIGN_KEY_CHECKS = 0;");
    await db.query("truncate users", { type: QueryTypes.BULKDELETE });
    await db.query("SET FOREIGN_KEY_CHECKS = 1;");
}

async function insert(user) {
    user.password_hash = await bcrypt.hash(user.password, salt);
    const result = await db.query(`
    insert into users (name, email, username, password_hash, role) values (:name, :email, :username, :password_hash, :role)
`, {
        replacements: user,
        type: QueryTypes.INSERT
    });
    const user_id = result[0];
    const token = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET);
    return { user_id, token };
}

async function findUserById(id) {
    const users = await db.query(`select id, name, username, email from users where id = :id`, {
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
    const users = await db.query("select id, name, username, email from users", { type: QueryTypes.SELECT });
    res.json({ users }).status(200);
}

async function get(req, res) {
    const { password_hash, ...user } = await findUserById(Number(req.params.id))

    res.json(user).status(200);
}

async function create(req, res) {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: 'customer'
        };
        const { user_id, token } = await insert(user);
        res.status(201).json({ id: user_id, token });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function update(req, res) {
    const id = Number(req.params.id)

    await findUserById(id);

    const user = {
        id,
        name: req.body.name,
        email: req.body.email,
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

    res.status(201).json(favorite);
}

function deleteUserFavorite(id) {
    favorites = favorites.filter(it => it.userId === id)
}


function removeFavorites(req, res) {
    deleteUserFavorite(req.body.id);

    res.status(201).json(favorite);
}

module.exports = {
    clean,
    listAll,
    get,
    create,
    update,
    remove,
    createFavorite,
    removeFavorites,
    insert
};