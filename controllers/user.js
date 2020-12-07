let users = [];

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

module.exports = {
    listAll,
    get,
    create,
    update,
    remove
};