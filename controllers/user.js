let user = [];

function get(req, res) {
    res.json({ user }).status(200);
}

function create(req, res) {
    user.push({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    res.json(user).status(201);
}

function update(req, res) {}

function remove(req, res) {}


module.exports = {
    get,
    create,
    update,
    remove
};