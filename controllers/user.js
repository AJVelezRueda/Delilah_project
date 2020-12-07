let users = [];
let favorites = [];

function findUserById(id) {
    return users.find(it => it.id === id);
}

function deleteUserById(id) {
    users = users.filter(it => it.id === id)
}

function listAll(req, res) {
    res.json({ users }).status(200);
}

function get(req, res) {
    res.json(findUserById(req.body.id))
        .status(200);
}

function create(req, res) {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    users.push(user);

    res.json(user).status(201);
}

function update(req, res) {
    const user = findUserById(req.body.id);

    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    res.json(user).status(201);
}

function remove(req, res) {
    deleteUserById(req.body.id);

    res.json(users).status(201);
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
    update,
    remove,
    createFavorite,
    removeFavorites
};