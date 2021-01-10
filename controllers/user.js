const { QueryTypes } = require("sequelize");
const { db, cleanTable, deleteResoueceById } = require("../database");
const { insert, findUserById, getUsersData, updateUserData } = require("../models/user-repository");


async function clean() {
    cleanTable('users');
}

async function deleteUserById(id) {
    await deleteResoueceById('users', id);
}

async function listAll(req, res) {
    const users = await getUsersData();
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

    await updateUserData(user);

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